const headerStyles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      backgroundColor: 'white',
      borderBottom: '1px solid ',
      height: '64px',
    },
    leftSection: {
      flex: 1,
    },
    centerSection: {
      flex: 2,
      display: 'flex',
      alignItems: 'center',
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    pageTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '0', 
    },
    searchInput: {
      width: '200px', 
      marginLeft: '20px',
    },
    icon: {
      fontSize: '20px',
      cursor: 'pointer',
      marginLeft: '20px',
    },
    avatar: {
      cursor: 'pointer',
    },
  };
  
  export default headerStyles;