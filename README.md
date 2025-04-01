# Drupal Toggle

A Chrome extension that lets you toggle the visibility of Drupal administrative elements (toolbar, admin menu, etc.) for a cleaner viewing experience.

## Features

- Hide/show Drupal admin toolbar with a single click
- Works independently for each tab - toggle state does not affect other tabs
- Handles both horizontal (top) and vertical (left) admin toolbars
- Remembers your preference as you navigate between pages on the same tab
- Prevents admin elements from flashing during page navigation
- Restores original page layout when admin elements are shown again

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the `drupaltoggle` folder
5. The extension icon should now appear in your Chrome toolbar

## Usage

- Click the extension icon to hide Drupal admin elements on the current tab (icon changes to indicate "off" state)
- Click again to show admin elements (icon changes to indicate "on" state)
- Each tab maintains its own toggle state - you can have admin elements hidden in one tab while visible in another
- Your preference will be remembered as you navigate between pages on the same tab
- If admin elements don't reappear correctly when toggled back on, refresh the page

## How it Works

This extension:

1. Manages toggle state independently for each browser tab
2. Injects scripts that save original page styling
3. Modifies CSS/HTML to hide admin elements and restore page layout
4. Uses a content script that runs at document start to prevent admin elements from flashing
5. Handles both horizontal (top) and vertical (left) admin toolbar layouts

## Files

- **manifest.json** - Extension configuration and permissions
- **background.js** - Handles extension icon clicks and tab-specific toggle functionality
- **content.js** - Runs on page load to apply or remove admin element styling based on tab state
- **icon-on.png** / **icon-off.png** - Extension icons for different toggle states

## Compatibility

This extension is designed to work with Drupal 8+ sites using the standard admin toolbar. Some custom admin themes may require adjustments.

## Troubleshooting

- **Admin elements don't reappear**: If toggling admin elements back on doesn't work correctly, refresh the page
- **Toggle state seems inconsistent**: Remember that each tab has its own independent toggle state
- **Page layout issues**: Some Drupal themes with custom admin styling may require additional CSS adjustments

## License

MIT License