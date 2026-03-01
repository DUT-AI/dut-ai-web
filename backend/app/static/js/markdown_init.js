document.addEventListener("DOMContentLoaded", function () {
  console.log("Markdown init script loaded");

  setTimeout(function () {
    const textareas = document.querySelectorAll("textarea");
    console.log("Found textareas:", textareas.length);

    textareas.forEach(function (textarea) {
      if (
        textarea.name === "content" ||
        textarea.id === "content" ||
        textarea.name === "description" ||
        textarea.name === "features" ||
        textarea.name === "technologies"
      ) {
        console.log("Initializing EasyMDE for:", textarea.name);

        // Custom upload function: gửi ảnh lên MinIO qua API
        function imageUploadFunction(file, onSuccess, onError) {
          const formData = new FormData();
          formData.append("file", file);

          fetch("/api/v1/blogs/upload-async", {
            method: "POST",
            body: formData,
          })
            .then(function (response) {
              if (!response.ok) {
                throw new Error("Upload thất bại (HTTP " + response.status + ")");
              }
              return response.json();
            })
            .then(function (data) {
              if (data.url) {
                onSuccess(data.url);
              } else {
                onError("Server không trả về URL ảnh.");
              }
            })
            .catch(function (err) {
              onError(err.message || "Lỗi kết nối khi tải ảnh lên.");
            });
        }

        new EasyMDE({
          element: textarea,
          spellChecker: false,
          forceSync: true,

          // --- Image upload config ---
          uploadImage: true,
          imageUploadFunction: imageUploadFunction,
          imageMaxSize: 5 * 1024 * 1024, // 5MB
          imageAccept: "image/png, image/jpeg, image/jpg, image/gif, image/webp",

          // Thông báo tiếng Việt
          imageTexts: {
            sbInit: "Kéo thả ảnh hoặc paste ảnh vào đây để tải lên.",
            sbOnDragEnter: "Thả ảnh để tải lên...",
            sbOnDrop: "Đang tải ảnh lên...",
            sbProgress: "Đang tải: #progress%",
            sbOnUploaded: "Tải ảnh thành công!",
          },
          errorMessages: {
            noFileGiven: "Bạn cần chọn một file ảnh.",
            typeNotAllowed: "Loại file này không được hỗ trợ. Chỉ chấp nhận: png, jpg, gif, webp.",
            fileTooLarge:
              "Ảnh quá lớn. Giới hạn tối đa: #image_max_size.",
            importError:
              "Lỗi khi tải ảnh lên. Vui lòng thử lại.",
          },
        });
      }
    });
  }, 500);
});
