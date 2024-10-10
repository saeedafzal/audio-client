const mediaDialog = id("media-dialog");

function toggleMediaDialog() {
    mediaDialog.open ? mediaDialog.close() : mediaDialog.showModal();
}