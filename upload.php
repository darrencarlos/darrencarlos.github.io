<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['video'])) {
        if ($_FILES['video']['error'] == UPLOAD_ERR_OK) {
            $uploads_dir = 'uploads';
            $tmp_name = $_FILES['video']['tmp_name'];
            $name = basename($_FILES['video']['name']);
            $target_file = "$uploads_dir/$name";

            if (!is_dir($uploads_dir)) {
                mkdir($uploads_dir, 0755, true);
            }

            if (move_uploaded_file($tmp_name, $target_file)) {
                echo "Video uploaded successfully: <a href='$target_file'>$name</a>";
            } else {
                echo "Error moving the uploaded file.";
            }
        } else {
            echo "Error uploading file: " . $_FILES['video']['error'];
        }
    } else {
        echo "No file uploaded.";
    }
} else {
    echo "Invalid request method.";
}
?>