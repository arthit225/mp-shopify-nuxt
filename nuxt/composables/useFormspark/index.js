
import Botpoison from "@botpoison/browser";
import { UploadClient } from '@uploadcare/upload-client';

export default function useFormspark() {

  const client = new UploadClient({ publicKey: 'c84e346d54b17919469a' })
  
  const botpoison = new Botpoison({
    publicKey: "pk_2c599ac8-4678-4cb8-8242-f5e18a3823c0"
  })

  //const { solution } = botpoison.challenge()

  const submitFormsparkForm = async (e, formId,submitText, successMessage, successText) => {

    //submitText.textContent = 'Submitting...'

    console.log(e, formId, submitText, successMessage, successText);

    e.target.setAttribute('disabled', 'disabled');

    const { solution } = await botpoison.challenge();

    const formData = new FormData(e.target)
    let className = "";
    let formBody = {}

    formBody['_botpoison'] = solution
    
    for (const [key, value] of formData) {
      formBody[key] = value
    }

    const FORMSPARK_ACTION_URL = `https://submit-form.com/${formId}`;
  
    const res = await fetch(FORMSPARK_ACTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(formBody)      
    })
      .then( (res) => {
        console.log(res)
        if(res.status == 404 ){
          className = 'error'
        }
        else {
          className = 'success'
        }
        if (res.status == 200 ) {
          //200 will be a success.
          console.log(res.status)
          e.target.removeAttribute('disabled');
          //e.target.reset();
          submitText.textContent = 'Submitted'
          if (successMessage) {
            successMessage.textContent = res.statusText ? res.statusText : successText ? successText : "Success!";
            successMessage.classList.add(className);
          }
        } else {
          if (successMessage) {
            successMessage.textContent = res.statusText ? res.statusText : res.status + ": Failed";
            successMessage.classList.add(className);
          }
        }
        return res
      })
      .catch(() => {
        alert("Something went wrong, please submit the form again");
        e.target.removeAttribute('disabled');
        return false
      })
      return res
  } //END submitFormsparkForm

  return {
    submitFormsparkForm
  }
}
