/*===== Resize Navbar on Scroll =====*/
var navbar = document.querySelector(".navbar");
// when the scroll is higher than 20 viewport height, add the sticky classs to the tag with a class navbar
window.onscroll = () => {
    this.scrollY > 20 ? navbar.classList.add("sticky") : navbar.classList.remove("sticky");
}
/*===== Nav Toggler =====*/
const navMenu = document.querySelector(".menu");
navToggle = document.querySelector(".menu-btn");
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    })
}
// closing menu when link is clicked
const navLink = document.querySelectorAll(".nav-link");
function linkAction() {
    const navMenu = document.querySelector(".menu");
    navMenu.classList.remove("active")
}
navLink.forEach(n => n.addEventListener("click", linkAction))

/*===== Dropdown Menu =====*/
function toggleDropdown(event) {
    event.preventDefault();
    const dropdownMenu = event.currentTarget.nextElementSibling;
    dropdownMenu.classList.toggle('show');
    document.addEventListener('click', closeDropdownOnClickOutside);
    dropdownMenu.addEventListener('click', closeDropdownOnClickInside);
}

function closeDropdownOnClickOutside(event) {
    const dropdownMenu = document.querySelector('.dropdown-menu.show');
    if (dropdownMenu && !dropdownMenu.contains(event.target) && !event.target.closest('.dropdown-toggle')) {
        dropdownMenu.classList.remove('show');
        document.removeEventListener('click', closeDropdownOnClickOutside);
        dropdownMenu.removeEventListener('click', closeDropdownOnClickInside);
    }
}

function closeDropdownOnClickInside(event) {
    const dropdownMenu = event.currentTarget;
    dropdownMenu.classList.remove('show');
    document.removeEventListener('click', closeDropdownOnClickOutside);
    dropdownMenu.removeEventListener('click', closeDropdownOnClickInside);
}

function copyToClipboard() {
    const emailText = document.getElementById('email-text').innerText;
    navigator.clipboard.writeText(emailText)
}

/*===== Scroll Section Active Link =====*/

const Section = document.querySelectorAll('section[id]')
function scrollActive() {
    const scrollY = window.scrollY
    Section.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.links a[href*=' + sectionId + ']').classList.add('active')
        }
        else {
            document.querySelector('.links a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}
window.addEventListener('scroll', scrollActive)