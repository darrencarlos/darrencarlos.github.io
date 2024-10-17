<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['video']) && $_FILES['video']['error'] == 0) {
        $uploads_dir = 'uploads';
        $tmp_name = $_FILES['video']['tmp_name'];
        $name = basename($_FILES['video']['name']);
        
        // Set the target file path
        $target_file = "$uploads_dir/$name";

        // Create uploads directory if it doesn't exist
        if (!is_dir($uploads_dir)) {
            mkdir($uploads_dir, 0755, true);
        }

        // Move the uploaded file to the target directory
        if (move_uploaded_file($tmp_name, $target_file)) {
            echo "Video uploaded successfully: <a href='$target_file'>$name</a>";
        } else {
            echo "Error uploading video.";
        }
    } else {
        echo "No file uploaded or there was an upload error.";
    }
} else {
    echo "Invalid request method.";
}
?>