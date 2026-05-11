<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="delete-modal">
            <div class="modal-header">
                <h3>Confirm Deletion</h3>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this configuration?!</p>
            </div>
            <div class="modal-footer">
                <button class="btn-no" @click="$emit('close')">No</button>
                <button class="btn-yes" @click="$emit('confirm')">Yes</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; /* Mesti fixed */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Gelapkan background agar fokus */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Pastikan paling tinggi dari elemen manapun */
}

.delete-modal {
    background: white;
    padding: 24px;
    border-radius: 16px;
    width: 320px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h3 {
    margin: 0 0 12px;
    font-size: 18px;
    color: #1c1c1e;
}

p {
    font-size: 14px;
    color: #636366;
    margin-bottom: 24px;
    line-height: 1.4;
}

.modal-footer {
    display: flex;
    gap: 12px;
}

button {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: opacity 0.2s;
}

.btn-no {
    background: #F2F2F7;
    color: #1c1c1e;
}

.btn-yes {
    background: #FF3B30;
    color: white;
}

button:hover {
    opacity: 0.8;
}
</style>