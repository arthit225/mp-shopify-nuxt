import formidable from 'formidable';
import FormData from 'form-data';
import useShopify from '~~/composables/useShopify';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const shopifyAdminApiKey = config.shopifyAdminApiAccessToken;

  // this form handles multipart/form-data file using formidable
  const form = formidable({ multiples: true, maxFileSize: 2 * 1024 * 1024 });
  let avatarFile = null;
  let customerId = null;

  await new Promise((resolve, reject) => {
    form.parse(event.req, (err, fields, files) => {
      avatarFile = files.file;
      customerId = fields.customerId
      resolve();
    });
  });

  // Handling first request, this returns us aws special parameters, that allows temporary to upload files to it
  const { resourceUrl, parameters, url } = await handleStagedUploadsCreate({
    file: avatarFile,
    shopifyAdminApiKey: shopifyAdminApiKey,
  });

  // Second request, actually uploading data to aws of shopify
  const succesfullyUploaded = await handleUploadingData({
    url,
    parameters,
    file: avatarFile,
  });

  if (!succesfullyUploaded)
    return { success: false, message: 'failed to upload file' };

  const { fileId } = await fileCreateInShopify({
    shopifyAdminApiKey,
    resourceUrl,
  });

  if (!fileId)
    return { success: false, message: 'createFile failed, fileId: null' };

  return await updateCustomerFields(
    {
      id: customerId,
      metafield: {
        namespace: 'customer_info',
        key: 'avatar',
        value: fileId,
      },
    },
    shopifyAdminApiKey
  );
});

async function handleStagedUploadsCreate(options) {
  const { file, shopifyAdminApiKey } = options;

  const query = `
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        resourceUrl
        url
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  `;

  const variables = {
    input: {
      resource: 'FILE',
      filename: file.newFilename,
      mimeType: file.mimetype,
      httpMethod: 'POST',
    },
  };

  try {
    const stagedData = await $fetch(
      'https://majestyspleasure.myshopify.com/admin/api/2022-04/graphql.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAdminApiKey,
        },
        body: {
          query,
          variables,
        },
      }
    );

    let resourceUrl =
      stagedData.data.stagedUploadsCreate.stagedTargets[0].resourceUrl;
    let parameters =
      stagedData.data.stagedUploadsCreate.stagedTargets[0].parameters;
    let url = stagedData.data.stagedUploadsCreate.stagedTargets[0].url;

    return {
      resourceUrl,
      parameters,
      url,
    };
  } catch (err) {
    console.error(err);

    return {
      resourceUrl: null,
      parameters: null,
      url: null,
    };
  }
}

async function handleUploadingData(options) {
  const { parameters, file, url } = options;

  const formData = new FormData();

  parameters.forEach(({ name, value }) => {
    formData.append(name, value);
  });

  formData.append('file', fs.createReadStream(file.filepath));
  const headers = formData.getHeaders();
  headers['Content-Length'] = file.size + 5000; // +5000 because otherwise it fails (giving extra space in case)

  try {
    const response = await $fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
  } catch (err) {
    console.log(err, 'There was error uploading form data');
    return false; // there was an error uploading the form data
  }

  return true;
}

async function fileCreateInShopify(options) {
  const { shopifyAdminApiKey, resourceUrl } = options;

  const query = `
    mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        userErrors {
          message
          code
          field
        }
        files {
          fileStatus
          fileErrors {
            code
            details
            message
          }
          preview {
            status
            image {
              id
            }
          }
          ... on MediaImage {
            originalSource {
              fileSize
            }
            mimeType
            image {
              originalSrc
              transformedSrc(maxWidth: 500)
              src
              url
              id
            }
            status
            id
          }
        }
      }
    }
    `;

  const variables = {
    files: {
      alt: 'avatar',
      originalSource: resourceUrl,
      contentType: 'IMAGE',
    },
  };

  try {
    const fileUploadData = await $fetch(
      'https://majestyspleasure.myshopify.com/admin/api/2022-04/graphql.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAdminApiKey,
        },
        body: {
          query,
          variables,
        },
      }
    );
    console.log(fileUploadData, 'fileuploaddata');
    const fileId = fileUploadData.data.fileCreate.files[0].id;
    return {
      fileId,
    };
  } catch (err) {
    console.error(err);
  }

  return {
    fileId: null,
  };
}

async function updateCustomerFields(customerDataInput, shopifyAdminApiKey) {
  console.log(customerDataInput);
  const query2 = `
  mutation updateCustomerMetafield {
    customerUpdate(
      input: {id: "${customerDataInput.id}", metafields: {namespace: "${customerDataInput.metafield.namespace}", key: "${customerDataInput.metafield.key}", value: "${customerDataInput.metafield.value}"}}
    ){
      customer{
        id
        metafield(namespace: "${customerDataInput.metafield.namespace}", key: "${customerDataInput.metafield.key}"){
          key
          value
          reference {
            ... on MediaImage {
              image {
                originalSrc
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

  try {
    const request = await $fetch(
      'https://majestyspleasure.myshopify.com/admin/api/2022-04/graphql.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': `${shopifyAdminApiKey}`,
        },
        body: {
          query: query2,
        },
      }
    );
    console.log(JSON.stringify(request), request, 'admin api request');
    return request
  } catch (err) {
    console.error(err);
  }
}
