// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD0hwDTOwhqzp_GqfF8EVIeVJ8dVvbHOwk",
    authDomain: "databaseDevelopment.firebaseapp.com",
    projectId: "databaseDevelopment",
    storageBucket: "databaseDevelopment.appspot.com",
    messagingSenderId: "957626402723",
    appId: "1:957626402723:web:a63d86093f95d20f33c16"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Form Submission
document.getElementById("updateForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const developer = document.getElementById("developer").value;
    const newFeature = document.getElementById("newFeature").value;
    const fixedFeature = document.getElementById("fixedFeature").value;
    const imageFile = document.getElementById("imageUpload").files[0];

    if (!imageFile) {
        alert("Harap unggah gambar!");
        return;
    }

    // Upload image to Firebase Storage
    const storageRef = storage.ref("updates/" + imageFile.name);
    const uploadTask = storageRef.put(imageFile);

    uploadTask.on("state_changed", null, error => {
        console.error("Upload gagal: ", error);
    }, async () => {
        const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();

        // Simpan data ke Firestore
        const docRef = await db.collection("DevelopmentUpdate").add({
            developer,
            newFeature,
            fixedFeature,
            imageUrl,
            timestamp: new Date()
        });

        // Kirim notifikasi ke Discord Webhook
        const webhookURL = "https://discord.com/api/webhooks/1353550479472332800/kNlmmnau2hkqwjiGSD7rdkUcGNZc6zAbrG2OQhy94rKZmfrjT7RRwp274yOa-PpVqrZG";
        fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `🚀 **Game Update** 🚀\n👨‍💻 Developer: ${developer}\n🆕 Fitur Baru: ${newFeature}\n🔧 Fixed: ${fixedFeature}\n🖼️ Gambar: ${imageUrl}`
            })
        });

        document.getElementById("status").innerText = "Update berhasil dikirim!";
    });
});
