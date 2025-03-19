// Initialize the toggle state
chrome.storage.local.get(['toggleState'], function(result) {
  if (result.toggleState === undefined) {
    chrome.storage.local.set({toggleState: false});
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(['toggleState'], function(result) {
    const newState = !result.toggleState;
    
    // Update the icon based on the new state
    chrome.action.setIcon({
      path: newState ? "icon-on.png" : "icon-off.png",
      tabId: tab.id
    });
    
    // Save the new state
    chrome.storage.local.set({toggleState: newState});
    
    // Execute the toggle function with the new state
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function(state) {
        // All functions need to be defined inside this closure
        
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
          
          // Save body margin for vertical toolbar
          if (document.body.classList.contains('toolbar-tray-open') && 
              document.body.classList.contains('toolbar-vertical') &&
              document.body.classList.contains('toolbar-fixed')) {
            document.body.dataset.originalMarginInlineStart = 
              document.body.style.marginInlineStart || 
              getComputedStyle(document.body).marginInlineStart;
          }
          
          // Save values from HTML element
          const html = document.documentElement;
          html.dataset.originalScrollPaddingTop = html.style.scrollPaddingTop || getComputedStyle(html).scrollPaddingTop;
          html.dataset.originalDisplaceOffsetTop = html.style.getPropertyValue('--drupal-displace-offset-top') || getComputedStyle(html).getPropertyValue('--drupal-displace-offset-top');
          html.dataset.originalDisplaceOffsetLeft = html.style.getPropertyValue('--drupal-displace-offset-left') || getComputedStyle(html).getPropertyValue('--drupal-displace-offset-left');
          html.dataset.originalScrollbarWidth = html.style.getPropertyValue('--scrollbar-width') || getComputedStyle(html).getPropertyValue('--scrollbar-width');
          
          // Save main content position values
          const mainContent = document.querySelector('main.page-content, #main-wrapper, #main-content');
          if (mainContent) {
            mainContent.dataset.originalMarginLeft = mainContent.style.marginLeft || getComputedStyle(mainContent).marginLeft;
            mainContent.dataset.originalTransform = mainContent.style.transform || getComputedStyle(mainContent).transform;
          }
          
          // Save left toolbar values
          const leftToolbar = document.querySelector('.toolbar-tray.toolbar-tray-horizontal.is-active, #toolbar-item-administration-tray.toolbar-tray-vertical.is-active');
          if (leftToolbar) {
            leftToolbar.dataset.originalDisplay = leftToolbar.style.display || getComputedStyle(leftToolbar).display;
          }
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
          
          // Reset body margin for vertical toolbar
          if (document.body.classList.contains('toolbar-tray-open') && 
              document.body.classList.contains('toolbar-vertical') &&
              document.body.classList.contains('toolbar-fixed')) {
            document.body.style.marginInlineStart = '0';
          }
          
          // Remove HTML element styles
          const html = document.documentElement;
          html.style.scrollPaddingTop = '';
          html.style.setProperty('--drupal-displace-offset-top', '');
          html.style.setProperty('--drupal-displace-offset-left', ''); // Add this line
          // Keep scrollbar width as it's not related to admin toolbar
          
          // Reset main content positioning
          const mainContent = document.querySelector('main.page-content, #main-wrapper, #main-content');
          if (mainContent) {
            mainContent.style.marginLeft = '';
            mainContent.style.transform = 'none';
          }
          
          // Hide left toolbar
          const leftToolbar = document.querySelector('.toolbar-tray.toolbar-tray-horizontal.is-active, #toolbar-item-administration-tray.toolbar-tray-vertical.is-active');
          if (leftToolbar) {
            leftToolbar.style.display = 'none';
          }
        }
        
        function restoreOriginalValues() {
          // Restore toolbar and highlighted elements
          const toolbar = document.querySelector('div#toolbar-administration');
          if (toolbar && toolbar.dataset.originalDisplay) {
            toolbar.style.display = toolbar.dataset.originalDisplay;
          }
          
          const highlighted = document.querySelector('div.page > div.highlighted');
          if (highlighted && highlighted.dataset.originalDisplay) {
            highlighted.style.display = highlighted.dataset.originalDisplay;
          }
          
          // Restore body
          const body = document.body;
          if (body.dataset.originalPaddingTop) {
            body.style.paddingTop = body.dataset.originalPaddingTop;
          }
          
          // Restore body margin for vertical toolbar
          if (document.body.dataset.originalMarginInlineStart) {
            document.body.style.marginInlineStart = document.body.dataset.originalMarginInlineStart;
          }
          
          // Restore HTML element
          const html = document.documentElement;
          if (html.dataset.originalScrollPaddingTop) {
            html.style.scrollPaddingTop = html.dataset.originalScrollPaddingTop;
          }
          if (html.dataset.originalDisplaceOffsetTop) {
            html.style.setProperty('--drupal-displace-offset-top', html.dataset.originalDisplaceOffsetTop);
          }
          if (html.dataset.originalDisplaceOffsetLeft) {
            html.style.setProperty('--drupal-displace-offset-left', html.dataset.originalDisplaceOffsetLeft);
          }
          if (html.dataset.originalScrollbarWidth) {
            html.style.setProperty('--scrollbar-width', html.dataset.originalScrollbarWidth);
          }
          
          // Restore main content positioning
          const mainContent = document.querySelector('main.page-content, #main-wrapper, #main-content');
          if (mainContent) {
            if (mainContent.dataset.originalMarginLeft) {
              mainContent.style.marginLeft = mainContent.dataset.originalMarginLeft;
            }
            if (mainContent.dataset.originalTransform) {
              mainContent.style.transform = mainContent.dataset.originalTransform;
            }
          }
          
          // Restore left toolbar
          const leftToolbar = document.querySelector('.toolbar-tray.toolbar-tray-horizontal.is-active, #toolbar-item-administration-tray.toolbar-tray-vertical.is-active');
          if (leftToolbar && leftToolbar.dataset.originalDisplay) {
            leftToolbar.style.display = leftToolbar.dataset.originalDisplay;
          }
        }
        
        // Main toggle function logic
        if (state) {
          // We're turning things ON - apply saved values from data attributes if they exist
          restoreOriginalValues();
        } else {
          // We're turning things OFF - save current values to data attributes, then remove them
          saveOriginalValues();
          removeAdminStyles();
        }
      },
      args: [newState]
    });
  });
});