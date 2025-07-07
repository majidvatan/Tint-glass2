document.getElementById('upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const img = document.getElementById('preview');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const regionX = Math.floor(img.width * 0.6);
        const regionY = Math.floor(img.height * 0.4);
        const regionWidth = 50;
        const regionHeight = 50;

        const imageData = ctx.getImageData(regionX, regionY, regionWidth, regionHeight);
        let totalBrightness = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const brightness = (r + g + b) / 3;
            totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / (imageData.data.length / 4);
        let tintPercent = 100 - (avgBrightness / 255 * 100);
        tintPercent = Math.min(100, Math.max(0, Math.round(tintPercent)));

        document.getElementById('result').innerText = `درصد دودی بودن شیشه (تخمینی): ${tintPercent}٪`;
    };
});
