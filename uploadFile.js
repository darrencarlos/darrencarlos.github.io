function uploadFile() {
    const file = document.getElementById('fileButton').files[0];
    const storageRef = storage.ref('videos/' + file.name);
    
    storageRef.put(file).then(() => {
        alert('Upload successful!');
    }).catch((error) => {
        console.error('Upload failed:', error);
    });
}