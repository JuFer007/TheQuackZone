const avatars = [
    "https://i.pinimg.com/1200x/01/c0/c0/01c0c07a7e0cb74c3fd8ba16dc6fdb11.jpg",
    "https://i.pinimg.com/1200x/44/58/49/4458496f8099d7318b02cda23121b028.jpg",
    "https://i.pinimg.com/1200x/65/f3/50/65f350807513d5245b0aa27f811d8df8.jpg",
    "https://i.pinimg.com/736x/11/40/c6/1140c6684107a6b534764dfc97480c5f.jpg",
    "https://i.pinimg.com/1200x/0e/f1/8c/0ef18ce7f13c9c2295098ce854e2651e.jpg",
    "https://i.pinimg.com/1200x/ad/58/17/ad58178737a0aca3b7bac12b6bd20c58.jpg",
    "https://i.pinimg.com/736x/e0/8b/43/e08b437949a2eac6b7cf60bf8b132445.jpg",
    "https://i.pinimg.com/1200x/32/ab/8e/32ab8e139954f9a77d00368a088005ed.jpg",
    "https://i.pinimg.com/736x/35/86/d5/3586d5b3dbc6921fbdbdedabd4cee0e9.jpg",
    "https://i.pinimg.com/736x/f4/59/ab/f459ab7938ffde33b4f881410b9105b6.jpg",
    "https://i.pinimg.com/736x/db/84/0a/db840a7527a1365608192113557f0db2.jpg",
    "https://i.pinimg.com/736x/49/f0/bb/49f0bb6597391a53a4c967ce647f4e36.jpg",
    "https://i.pinimg.com/1200x/d6/56/30/d6563005b1426c070fbab4caef6f50f1.jpg",
    "https://i.pinimg.com/736x/32/8a/5d/328a5d8e3ddd700daddd64d9ec4a34f7.jpg",
    "https://i.pinimg.com/1200x/4b/1c/2e/4b1c2e8c526bde4019e2692f2fdc3b29.jpg",
];

const banners = [
    "https://i.pinimg.com/1200x/9c/86/e5/9c86e55ffc702c8f5a57749387e239ea.jpg",
    "https://i.pinimg.com/1200x/1d/4b/b7/1d4bb7355e36908106f740108302507d.jpg",
    "https://i.pinimg.com/1200x/88/8b/e3/888be332cc4ff73d2e89b0b661611a58.jpg",
    "https://i.pinimg.com/1200x/ae/f1/9f/aef19f867fde2676bb01a8b9ede43a5b.jpg",
    "https://i.pinimg.com/1200x/c8/02/1f/c8021f44b91f0ba7326eec723cbf50b3.jpg",
    "https://i.pinimg.com/1200x/2f/ba/19/2fba19f5c4448b23867d790c6559c08e.jpg"
];

let currentAvatar = avatars[0];
let tempSelectedAvatar = currentAvatar;
let currentBanner = banners[0];
let tempSelectedBanner = currentBanner;

function openViewModal() {
    document.getElementById('viewModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openEditModal() {
    document.getElementById('editModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalCurrentAvatar').src = currentAvatar;
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openAvatarModal() {
    tempSelectedAvatar = currentAvatar;
    loadAvatars();
    document.getElementById('avatarModal').classList.add('show');
}

function closeAvatarModal() {
    document.getElementById('avatarModal').classList.remove('show');
}

function loadAvatars() {
    const grid = document.getElementById('avatarGrid');
    grid.innerHTML = avatars.map((avatar, index) => `
        <label class="avatar-option ${avatar === tempSelectedAvatar ? 'selected' : ''}" data-avatar-url="${avatar}" onclick="selectTempAvatar(event, '${avatar}')">
            <input type="radio" name="avatar" value="${avatar}" ${avatar === tempSelectedAvatar ? 'checked' : ''}>
            <img src="${avatar}" alt="Avatar ${index + 1}">
            <div class="avatar-check">
                <i class="fas fa-check"></i>
            </div>
        </label>
    `).join('');
}

function selectTempAvatar(event, avatarUrl) {
    tempSelectedAvatar = avatarUrl;
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function openBannerModal() {
    tempSelectedBanner = currentBanner;
    loadBanners();
    document.getElementById('bannerModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeBannerModal() {
    document.getElementById('bannerModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function loadBanners() {
    const grid = document.getElementById('bannerGrid');
    grid.innerHTML = banners.map((banner, index) => `
        <label class="banner-option ${banner === tempSelectedBanner ? 'selected' : ''}" data-banner-url="${banner}" onclick="selectTempBanner(event, '${banner}')">
            <input type="radio" name="banner" value="${banner}" ${banner === tempSelectedBanner ? 'checked' : ''}>
            <img src="${banner}" alt="Banner ${index + 1}">
            <div class="banner-check">
                <i class="fas fa-check"></i>
            </div>
        </label>
    `).join('');
}

function selectTempBanner(event, bannerUrl) {
    tempSelectedBanner = bannerUrl;
    document.querySelectorAll('.banner-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

//TABS
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-tab-target');

        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

        this.classList.add('active');
        document.getElementById(targetId).style.display = 'block';
    });
});

document.getElementById('viewModal').addEventListener('click', function(e) {
    if (e.target === this) closeViewModal();
});

document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) closeEditModal();
});

document.getElementById('avatarModal').addEventListener('click', function(e) {
    if (e.target === this) closeAvatarModal();
});

document.getElementById('bannerModal').addEventListener('click', function(e) {
    if (e.target === this) closeBannerModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeViewModal();
        closeEditModal();
        closeAvatarModal();
        closeBannerModal();
    }
});