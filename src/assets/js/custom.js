function closeOverlay() {
    document.getElementById('checkout-overlay').style.display = 'none';
    document.getElementById('top').style.overflow = 'scroll';
}
function openOverlay() {
    document.getElementById('checkout-overlay').style.display = 'block';
    document.getElementById('top').style.overflow = 'hidden';
}