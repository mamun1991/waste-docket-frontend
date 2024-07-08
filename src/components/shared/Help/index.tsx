import {useEffect, useState} from 'react';

const Help = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Fetch the HTML content only on the client side
    if (typeof window !== 'undefined') {
      fetch('/help/WasteDocketHelp.html')
        .then(response => response.text())
        .then(data => {
          setHtmlContent(data);
        })
        .catch(error => console.error('Failed to load HTML content', error));
    }
  }, []);

  return (
    <div className='flex flex-col bg-white overflow-y-auto'>
      <div dangerouslySetInnerHTML={{__html: htmlContent}} />
    </div>
  );
};

export default Help;
