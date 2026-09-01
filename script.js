function completeTask() {

    document.getElementById("message").textContent =
        "🎉 Task completed!";

}


// Register Service Worker

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("Service Worker registered!");
            })
            .catch(error => {
                console.log("Service Worker registration failed:", error);
            });

    });

}