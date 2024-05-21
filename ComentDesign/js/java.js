const USERID = {
    name: null,
    identity: true, // Defaultnya identitas pengguna diatur sebagai true (bukan anonim)
    image: null,
    message: null,
    date: null,
    rating: 0
};

const userComment = document.querySelector(".usercomment");
const publishBtn = document.querySelector("#publish");
const comments = document.querySelector(".comments");
const userName = document.querySelector(".user");
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');

document.addEventListener("DOMContentLoaded", loadComments);

userComment.addEventListener("input", e => {
    togglePublishButton();
});

userName.addEventListener("input", e => {
    togglePublishButton();
});

publishBtn.addEventListener("click", addPost);

stars.forEach(star => {
    star.addEventListener('mouseover', handleMouseOver);
    star.addEventListener('mouseout', handleMouseOut);
    star.addEventListener('click', handleClick);
});

function handleMouseOver(event) {
    const value = event.target.getAttribute('data-value');
    highlightStars(value);
}

function handleMouseOut() {
    highlightStars(USERID.rating);
}

function handleClick(event) {
    const value = event.target.getAttribute('data-value');
    ratingValue.textContent = value;
    USERID.rating = value;
    selectStars(value);
    togglePublishButton();
}

function highlightStars(value) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= value) {
            star.classList.add('hover');
        } else {
            star.classList.remove('hover');
        }
    });
}

function selectStars(value) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= value) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

function togglePublishButton() {
    if (!userComment.value || !userName.value || USERID.rating === 0) {
        publishBtn.setAttribute("disabled", "disabled");
        publishBtn.classList.remove("abled");
    } else {
        publishBtn.removeAttribute("disabled");
        publishBtn.classList.add("abled");
    }
}

function addPost() {
    if (!userComment.value || !userName.value || USERID.rating === 0) return;

    USERID.name = userName.value;
    USERID.image = "/image/user.png"; // Menggunakan gambar pengguna yang tetap
    USERID.message = userComment.value;
    USERID.date = new Date().toLocaleString();

    let published = document.createElement('div');
    published.className = 'parents';
    published.innerHTML = `
        <img src="${USERID.image}" alt="User Image">
        <div>
            <h1>${USERID.name}</h1>
            <p>${USERID.message}</p>
            <p>Rating: ${USERID.rating} &#9733;</p>
            <span class="date">${USERID.date}</span>
            <button class="delete">Delete</button>
        </div>    
    `;

    comments.appendChild(published);

    saveComment({
        name: USERID.name,
        image: USERID.image,
        message: USERID.message,
        date: USERID.date,
        rating: USERID.rating
    });

    userComment.value = "";
    userName.value = "";
    USERID.rating = 0;
    ratingValue.textContent = 0;
    selectStars(0);
    publishBtn.setAttribute("disabled", "disabled");
    publishBtn.classList.remove("abled");

    updateCommentCount();

    // Tambahkan event listener untuk tombol delete yang baru dibuat
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', deletePost);
    });
}

function deletePost(event) {
    const commentElement = event.target.closest('.parents');
    if (!commentElement) return;

    commentElement.remove();

    // Ambil semua komentar dari penyimpanan lokal
    let commentsArray = JSON.parse(localStorage.getItem('comments')) || [];

    // Filter komentar yang akan dihapus berdasarkan tanggal dan isi komentarnya
    commentsArray = commentsArray.filter(comment => {
        return comment.date !== commentElement.querySelector('.date').textContent &&
               comment.message !== commentElement.querySelector('p').textContent;
    });

    // Simpan kembali komentar yang sudah difilter ke penyimpanan lokal
    localStorage.setItem('comments', JSON.stringify(commentsArray));

    // Perbarui jumlah komentar
    updateCommentCount();
}

function saveComment(comment) {
    let commentsArray = JSON.parse(localStorage.getItem('comments')) || [];
    commentsArray.push(comment);
    localStorage.setItem('comments', JSON.stringify(commentsArray));
}

function loadComments() {
    let commentsArray = JSON.parse(localStorage.getItem('comments')) || [];
    commentsArray.forEach(comment => {
        let published = document.createElement('div');
        published.className = 'parents';
        published.innerHTML = `
            <img src="${comment.image}" alt="User Image">
            <div>
                <h1>${comment.name}</h1>
                <p>${comment.message}</p>
                <p>Rating: ${comment.rating} &#9733;</p>
                <span class="date">${comment.date}</span>
                <button class="delete">Delete</button>
            </div>    
        `;
        comments.appendChild(published);
    });
    updateCommentCount();

    // Tambahkan event listener untuk tombol delete yang sudah ada
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', deletePost);
    });
}

function updateCommentCount() {
    let commentsNum = document.querySelectorAll(".parents").length;
    document.getElementById("comment").textContent = commentsNum;
}
