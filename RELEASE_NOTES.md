# GoogleRefreshed v1.5.4

A fresh installation now opens Google in the operating system's light or dark mode instead of always starting light. The default appearance is System, so the homepage, result pages, startup cover and hardware panel also follow later OS switches until a different mode is chosen. Reset settings to default returns to System as well.

Existing installations keep their saved Light, Dark or System choice. Settings saved before this version with no appearance field are treated as System.

Customize has a new **Open GoogleRefreshed in every new tab** toggle. Turning it on opens a small window that asks Brave for the optional tabs permission; declining turns the toggle back off. With the permission, a new tab on the browser's new-tab page opens https://www.google.com/ instead, while links opened in new tabs are left alone. Turning the toggle off, or resetting settings, releases the permission. The toggle is a local setting and is not included in browser settings sync.

New checks in isolated Brave profiles cover a first visit with a dark and a light OS, live OS switching on the homepage, result pages on a first visit, a saved Light choice staying light on a dark OS, the permission window and declined permission, and new-tab redirection with the setting on and off. No dependency or external request was added.

Reload GoogleRefreshed at brave://extensions and refresh Google, or refresh the local preview.
