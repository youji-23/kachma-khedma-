document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const workerForm = document.getElementById("workerForm");
    const workerList = document.getElementById("workerList");
    const jobList = document.getElementById("jobList");
    const registerSection = document.getElementById("register");

    const workers = JSON.parse(localStorage.getItem("workers")) || {};
    let currentUser = null;

    function displayWorkers() {
        workerList.innerHTML = "";
        if (currentUser && workers[currentUser]) {
            workers[currentUser].forEach(worker => {
                const div = document.createElement("div");
                div.innerHTML = `<p>${worker.name} - ${worker.skill}</p>`;
                if (worker.photo) {
                    const img = document.createElement("img");
                    img.src = worker.photo;
                    img.style.maxWidth = "200px";
                    div.appendChild(img);
                }
                if (worker.video) {
                    const video = document.createElement("video");
                    video.src = worker.video;
                    video.controls = true;
                    video.style.maxWidth = "200px";
                    div.appendChild(video);
                }
                if (worker.phone) {
                    const phone = document.createElement("p");
                    phone.textContent = `رقم الهاتف: ${worker.phone}`;
                    div.appendChild(phone);
                }
                workerList.appendChild(div);
            });
        }
    }

    const jobs = [];

    function displayJobs() {
        jobList.innerHTML = "";
        jobs.forEach(job => {
            const div = document.createElement("div");
            div.textContent = `${job.title} - ${job.description}`;
            jobList.appendChild(div);
        });
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const phone = document.getElementById("phone").value;
        currentUser = phone;
        if (!workers[currentUser]) {
            workers[currentUser] = [];
        }
        localStorage.setItem("currentUser", currentUser);
        registerSection.style.display = "block";
        displayWorkers();
    });

    currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        registerSection.style.display = "block";
        displayWorkers();
    }

    workerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const skill = document.getElementById("skill").value;
        const photo = document.getElementById("photo").files[0];
        const video = document.getElementById("video").files[0];

        const reader = new FileReader();
        reader.onload = function() {
            const workerData = { name, skill, photo: reader.result, video: null, phone: currentUser };
            if (video) {
                const videoReader = new FileReader();
                videoReader.onload = function() {
                    workerData.video = videoReader.result;
                    workers[currentUser].push(workerData);
                    localStorage.setItem("workers", JSON.stringify(workers));
                    displayWorkers();
                    workerForm.reset();
                };
                videoReader.readAsDataURL(video);
            } else {
                workers[currentUser].push(workerData);
                localStorage.setItem("workers", JSON.stringify(workers));
                displayWorkers();
                workerForm.reset();
            }
        };
        if (photo) {
            reader.readAsDataURL(photo);
        } else {
            workers[currentUser].push({ name, skill, photo: null, video: null, phone: currentUser });
            localStorage.setItem("workers", JSON.stringify(workers));
            displayWorkers();
            workerForm.reset();
        }
    });

    displayJobs();
});