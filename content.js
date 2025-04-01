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
    } else {
      // If toggle state is true, make sure we clean up any hiding styles
      const injectedStyle = document.getElementById('drupal-toggle-immediate-styles');
      if (injectedStyle) {
        injectedStyle.remove();
      }
    }
  });
})();

// Content script to prevent admin bar flashing and handle tab-specific toggle state
(function() {
  // First, get the current tab ID
  function getCurrentTabId() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({action: "getTabId"}, function(response) {
        resolve(response.tabId);
      });
    });
  }

  // Check the toggle state for this specific tab
  async function checkToggleState() {
    const tabId = await getCurrentTabId();
    
    chrome.storage.local.get(['tabStates'], function(result) {
      const tabStates = result.tabStates || {};
      const isToggleOff = tabStates[tabId] === false;
      
      if (isToggleOff) {
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
        
        // Apply other admin style hiding
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
        
        saveOriginalValues();
        removeAdminStyles();
      }
    });
  }
  
  // Check toggle state when page loads
  checkToggleState();
  
  // Listen for toggle state changes from the background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "toggleState") {
      if (message.state === true) {
        // Remove any injected style when toggled on
        const injectedStyle = document.getElementById('drupal-toggle-immediate-styles');
        if (injectedStyle) {
          injectedStyle.remove();
        }
        
        // Force a reload to properly restore admin UI
        window.location.reload();
      } else {
        // Reapply hiding styles when toggled off
        checkToggleState();
      }
    }
    
    return true; // Indicates async response
  });
})();

// Listen for toggle state changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.toggleState) {
    const newToggleState = changes.toggleState.newValue;
    
    if (newToggleState === true) {
      // Remove any injected style
      const injectedStyle = document.getElementById('drupal-toggle-immediate-styles');
      if (injectedStyle) {
        injectedStyle.remove();
      }
      
      // Show toolbar elements
      const toolbar = document.querySelector('div#toolbar-administration');
      if (toolbar) {
        toolbar.style.display = '';
      }
      
      const highlighted = document.querySelector('div.page > div.highlighted');
      if (highlighted) {
        highlighted.style.display = '';
      }
      
      // Force a small delay then reload the page to properly restore admin UI
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }
});