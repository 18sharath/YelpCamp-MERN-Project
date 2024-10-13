<script>
                (() => {
                    'use strict';
            
                    // Fetch all the forms we want to apply custom Bootstrap validation styles to
                    const forms = document.querySelectorAll('.validated-form');
            
                    // Loop over them and prevent submission
                    Array.from(forms).forEach(form => {
                        form.addEventListener('submit', event => {
                            // Check if the form is valid
                            if (!form.checkValidity()) {
                                event.preventDefault(); // Prevent submission
                                event.stopPropagation(); // Stop propagation of the event
                            }
            
                            // Add Bootstrap validation classes
                            form.classList.add('was-validated');
                        })
                    })
                })();
            </script>
