export default function useSidebar() {
  const isSidebarOpen = useState('isSidebarOpen', () => false)
  
  return {isSidebarOpen, toggleSidebar, closeSidebar}

  function toggleSidebar(){
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function closeSidebar(){
    isSidebarOpen.value = false;
  }
}
