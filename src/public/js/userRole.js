// Edición de roles de usuario
document.addEventListener('DOMContentLoaded', () => {
    const editRoleButton = document.querySelector('.edit-role-btn');
    if (editRoleButton) {
        editRoleButton.addEventListener('click', event => {
            const userId = event.target.dataset.userId;
            const userRole = event.target.dataset.userRole;
            const modal = document.getElementById('editRoleModal');
            const roleSelect = modal.querySelector('#role');
            roleSelect.value = userRole;
            modal.querySelector('form').onsubmit = function(e) {
                e.preventDefault();
                const newRole = roleSelect.value;
                fetch(`/users/${userId}/edit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ role: newRole })
                })
                .then(response => {
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        alert('Failed to update user role.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to update user role.');
                });
            };
            $('#editRoleModal').modal('show');
        });
    }
});