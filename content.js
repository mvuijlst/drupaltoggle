// This script runs when the page loads
(function() {
  // Check the toggle state from storage
  chrome.storage.local.get(['toggleState'], function(result) {
    if (result.toggleState === false) {  // If toggle is off
      // Reuse the toggle functions
      function saveOriginalValues() {
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
        
        // Save HTML element classes and properties
        const html = document.documentElement;
        html.dataset.originalClasses = html.className;
        html.dataset.originalScrollPaddingTop = html.style.scrollPaddingTop || getComputedStyle(html).scrollPaddingTop;
        html.dataset.originalDisplaceOffsetTop = html.style.getPropertyValue('--drupal-displace-offset-top') || getComputedStyle(html).getPropertyValue('--drupal-displace-offset-top');
        html.dataset.originalDisplaceOffsetLeft = html.style.getPropertyValue('--drupal-displace-offset-left') || getComputedStyle(html).getPropertyValue('--drupal-displace-offset-left');
        html.dataset.originalScrollbarWidth = html.style.getPropertyValue('--scrollbar-width') || getComputedStyle(html).getPropertyValue('--scrollbar-width');
      }
      
      function removeAdminStyles() {
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
        
        // Remove HTML element styles and classes
        const html = document.documentElement;
        html.classList.remove('toolbar-tray-open', 'toolbar-horizontal', 'toolbar-vertical');
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

// Content script to prevent admin bar flashing

// Immediately check if admin bars should be hidden
chrome.storage.local.get(['toggleState'], function(result) {
  if (result.toggleState === false) {
    // Create and inject styles to hide admin elements immediately
    const style = document.createElement('style');
    style.id = 'drupal-toggle-immediate-styles';
    style.textContent = `
      div#toolbar-administration, 
      .toolbar-tray,
      div.page > div.highlighted {
        display: none !important;
      }
      body {
        padding-top: 0 !important;
      }
      html {
        --drupal-displace-offset-top: 0 !important;
        --drupal-displace-offset-left: 0 !important;
        scroll-padding-top: 0 !important;
      }
      /* Fix for vertical toolbar margin */
      .toolbar-tray-open.toolbar-vertical.toolbar-fixed,
      body.toolbar-tray-open.toolbar-vertical.toolbar-fixed,
      html.toolbar-tray-open.toolbar-vertical.toolbar-fixed {
        margin-inline-start: 0 !important;
      }
      /* Remove toolbar-related classes effects */
      html.toolbar-tray-open {
        margin-inline-start: 0 !important;
      }
    `;
    
    // Insert as soon as possible
    (document.head || document.documentElement).appendChild(style);
    
    // Also immediately remove toolbar-related classes from HTML element
    document.documentElement.classList.remove('toolbar-tray-open', 'toolbar-horizontal', 'toolbar-vertical');
  }
});