// Bootstrap form validation
(function() {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();
zz
// Tax toggle for index page
document.addEventListener('DOMContentLoaded', function() {
  const taxSwitch = document.getElementById("switchCheckDefault");
  if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
      const taxInfoEls = document.getElementsByClassName("tax-info");
      for (let info of taxInfoEls) {
        info.style.display = info.style.display !== "inline" ? "inline" : "none";
      }
    });
  }
});
