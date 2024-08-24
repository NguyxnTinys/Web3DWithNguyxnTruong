// Tạo cảnh, camera và renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Thêm ánh sáng
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
pointLight2.position.set(-10, 10, -10);
scene.add(pointLight2);

// Tạo điều khiển OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Tải và hiển thị mô hình GLB
let model;
const loader = new THREE.GLTFLoader();
loader.load('Stitch.glb', function (gltf) {
    model = gltf.scene;
    model.position.y = 1; // Điều chỉnh vị trí của mô hình
    scene.add(model);
    renderer.render(scene, camera);
}, undefined, function (error) {
    console.error(error);
});

// Vị trí camera
camera.position.set(0, 0, 5);

// Biến lưu trữ trạng thái kéo
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Hàm render
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Cập nhật điều khiển
    renderer.render(scene, camera);
}
animate();

// Xử lý sự kiện chuột phải để kéo mô hình
renderer.domElement.addEventListener('mousedown', function(event) {
    if (event.button === 2) { // Kiểm tra nút chuột phải
        isDragging = true;
        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
        controls.enabled = false; // Vô hiệu hóa OrbitControls khi kéo
    }
});

renderer.domElement.addEventListener('mousemove', function(event) {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        model.position.y -= deltaMove.y * 0.01; // Di chuyển mô hình theo trục y

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

renderer.domElement.addEventListener('mouseup', function(event) {
    if (event.button === 2) { // Kiểm tra nút chuột phải
        isDragging = false;
        controls.enabled = true; // Bật lại OrbitControls sau khi kéo
    }
});

// Xử lý sự kiện thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
