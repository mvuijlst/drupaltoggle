// This script runs when the page loads
(function() {
  // Check the toggle state from storage
  chrome.storage.local.get(['toggleState'], function(result) {
    if (result.toggleState === false) {  // If toggle is off
      // Reuse the toggle functions
      function saveOriginalValues() {
        // Copy your existing saveOriginalValues function here
        // Save values from toolbar and highlighted elements
        const toolbar = document.querySelector('div#toolbar-administration');
        if (toolbar) {
          toolbar.dataset.originalDisplay = toolbar.style.display || getComputedStyle(toolbar).display;
        }
        
        const highlighted = document.querySelector('div.page > div.highlighted');
        if (highlighted) {
          highlighted.dataset.originalDisplay = highlighted.style.display || getComputedStyle(highlighted).display;
        }
        
        // Save values from body
        const body = document.body;
        body.dataset.originalPaddingTop = body.style.paddingTop || getComputedStyle(body).paddingTop;
        
        // Save values from HTML element
        const html = document.documentElement;
        html.dataset.originalScrollPaddingTop = html.style.scrollPaddingTop || getComputedStyle(html).scrollPaddingTop;
        html.dataset.originalDisplaceOffsetTop = html.style.getPropertyValue('--drupal-displace-offset-top') || getComputedStyle(html).getPropertyValue('--drupal-displace-offset-top');
        html.dataset.originalDisplaceOffsetLeft = html.style.getPropertyValue('--drupal-displace-offset-left') || getComputedStyle(html).getPropertyValue('--drupal-displace-offset-left');
        html.dataset.originalScrollbarWidth = html.style.getPropertyValue('--scrollbar-width') || getComputedStyle(html).getPropertyValue('--scrollbar-width');
      }
      
      function removeAdminStyles() {
        // Copy your updated removeAdminStyles function here
        // Hide toolbar and highlighted elements
        const toolbar = document.querySelector('div#toolbar-administration');
        if (toolbar) {
          toolbar.style.display = 'none';
        }
        
        const highlighted = document.querySelector('div.page > div.highlighted');
        if (highlighted) {
          highlighted.style.display = 'none';
        }
        
        // Remove body padding
        const body = document.body;
        body.style.paddingTop = '';
        
        // Remove HTML element styles
        const html = document.documentElement;
        html.style.scrollPaddingTop = '';
        html.style.setProperty('--drupal-displace-offset-top', '');
        html.style.setProperty('--drupal-displace-offset-left', '');
        // Keep scrollbar width as it's not related to admin toolbar
      }
      
      // Apply the hidden styles automatically
      saveOriginalValues();
      removeAdminStyles();
    }
  });
})();