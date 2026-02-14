document_id = "content"; // SQLAdmin usually uses the field name as ID

document.addEventListener("DOMContentLoaded", function() {
    console.log("Markdown init script loaded");
    setTimeout(function() {
        const textareas = document.querySelectorAll('textarea');
        console.log("Found textareas:", textareas.length);
        textareas.forEach(function(textarea) {
            if (textarea.name === "content" || textarea.id === "content" || textarea.name === "description") {
                console.log("Initializing EasyMDE for:", textarea.name);
                new EasyMDE({
                    element: textarea,
                    spellChecker: false,
                    forceSync: true,
                });
            }
        });
    }, 500); 
});
