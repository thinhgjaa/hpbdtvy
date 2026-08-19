# Kịch Bản Thiết Kế Giao Diện & Trải Nghiệm Mới cho Thiệp Sinh Nhật Xuân Thịnh

Dựa trên yêu cầu của bạn, chúng ta đã "đập đi xây lại" hoàn toàn trải nghiệm web hiện tại, biến nó từ một trang web tĩnh thành một **Hành trình cảm xúc (Cinematic Journey)** mang đậm tính điện ảnh và bất ngờ dành riêng cho **Xuân Thịnh**. 

Dưới đây là kịch bản trải nghiệm từng giây một (User Flow) phiên bản hoàn thiện nhất.

---

## 🎵 Kịch Bản Âm Thanh & Hiệu Ứng (Web Audio API)
Hệ thống âm thanh được lập trình trực tiếp bằng code để đảm bảo đồng bộ hoàn hảo với tương tác:
1. **Giai đoạn Đếm ngược:** Nhạc đếm ngược hồi hộp. Khi kết thúc đếm, nhạc sẽ **fade out (nhỏ dần) êm ái trong 1.2s** để nhường chỗ cho sự tĩnh lặng.
2. **Hiệu ứng tương tác:** 
   - Tiếng "Bốp" chân thực khi đập vỡ bóng bay rỗng.
   - Tiếng sột soạt lật giấy khi đập trúng bóng mang lời chúc.
3. **Giai đoạn Bùng nổ:** Bài hát sinh nhật vang lên rộn rã sau một "nhịp nghỉ" điện ảnh.

---

## 🎬 Kịch Bản Trải Nghiệm (Từng bước hiển thị)

### 1. Màn Khởi Đầu (The Mystery Gate)
- **Giao diện:** Toàn bộ màn hình tối đen huyền bí. Màn hình chờ (Preloader) hiển thị thanh tiến trình: *"Đang chuẩn bị điều bất ngờ cho Xuân Thịnh..."*
- **Tương tác:** Nút kéo dây (Pull Cord) nhấp nháy: *"Dành riêng cho Xuân Thịnh. Hãy bật loa to lên và chạm vào đây..."*
- **Hành động:** Khi kéo dây, chuyển sang Cảnh Đếm Ngược.

### 2. Cảnh Đếm Ngược 3-2-1 (The Cinematic Countdown)
- **Giao diện:** Màn hình tối, nhạc hồi hộp vang lên.
- **Hiệu ứng:** Số đếm ngược to chớp nháy đan xen lời nhắn gõ chữ:
  - Khung hình 1: **3**... -> *"Một ngày đặc biệt..."*
  - Khung hình 2: **2**... -> *"Dành cho một người vô cùng đặc biệt..."*
  - Khung hình 3: **1**... -> *"Tuổi 21 rực rỡ bắt đầu!"*
- **Khoảng Lặng Điện Ảnh:** Sau khi đếm xong, chữ số tắt lịm, âm thanh nhỏ dần. Màn hình rơi vào **bóng tối và tĩnh lặng tuyệt đối trong đúng 3.5 giây** để đẩy sự tò mò lên đỉnh điểm.

### 3. Cảnh Bùng Nổ & Bánh Kem 3D Khổng Lồ
- **Âm nhạc:** Nhạc sinh nhật tưng bừng bùng lên.
- **Giao diện xuất hiện:** 
  - Chiếc bánh kem 3D "Super Size" rực rỡ hiện ra ở trung tâm với đĩa vàng kim, lớp kem chảy sống động, cốm màu lấm tấm, dâu tây đỏ mọng và ngọn nến họa tiết xoắn.
  - Phía trên là dòng chữ **"HAPPY 21ST BIRTHDAY, XUÂN THỊNH"**.
  - Xung quanh rợp bóng bay lơ lửng và kim tuyến rơi.
- **Tương tác Ước Nguyện:** 
  - Dòng chữ *"Hãy nhắm mắt lại và ước một điều ước nhé... ✨"* từ từ được gõ ra.
  - Cố tình đợi thêm **3 giây** (để Xuân Thịnh nhắm mắt ước) rồi nút phát sáng **"Thổi Nến 🌬️"** mới bắt đầu xuất hiện.

### 4. Minigame "Đập Bóng Bay" (The Balloon Hunt)
- **Hành động:** Sau khi thổi nến, 12 quả bóng bay sẽ bay tứ tung lên trời. Bảng đếm số bắt đầu nhảy số ở góc.
- **Tương tác:** Xuân Thịnh phải chạm ngón tay để đập vỡ từng quả bóng (kèm tiếng "Bốp"). 
  - Quả bóng nào chứa lời chúc sẽ vang lên tiếng "mở giấy", hệ thống tạm khóa game, bắt người xem tập trung đọc lời chúc ngẫu nhiên trên màn hình. Đọc xong phải bấm "Nhận" mới được đập bóng tiếp.
  - Bộ đếm nhấp nháy cập nhật liên tục (Ví dụ: 8/12). Cuốn sổ sẽ rung lắc liên tục để nhắc nhở.

### 5. Cú Chót - Lật Mở Nhật Ký (The Grand Finale)
- **Hiệu ứng đặc biệt:** Khi quả bóng **cuối cùng** bị đập nổ tung, thay vì âm thầm xuất hiện ở góc, một cuốn "Nhật ký tuổi 21" sẽ **lập tức văng thẳng ra giữa màn hình** kèm pháo giấy rực rỡ (tạo cảm giác quyển sổ được giấu bên trong quả bóng cuối cùng đó).
- **Trải nghiệm lật sách 3D:** 
  - Bên trái: Khung ảnh Polaroid chứa hình ảnh của Xuân Thịnh (Có thể lật nhiều trang).
  - Bên phải: Những dòng nhắn nhủ chân thành.
- **Kết thúc:** Khi bấm nút "Đóng quyển nhật ký", quyển sổ mới ngoan ngoãn thu nhỏ lại và bay về góc phải màn hình, để lại dòng chữ *"Mở quyển nhật ký ở góc dưới nhé!"*

---

## 🏁 Bước Cuối Cùng Dành Cho Bạn (Final Steps)

> [!IMPORTANT]
> **Thay ảnh thật của Xuân Thịnh:**
> Trong file `index.html`, ở các trang sổ (dòng 160 và 183), mình đang để 2 link ảnh tạm. Bạn hãy tìm từ khóa `<img src="https://cdn-icons-png...` và đổi thành đường link hình ảnh thật xinh đẹp của Xuân Thịnh nhé (hoặc tải file ảnh bỏ chung thư mục code rồi đổi thành `src="hinh-cua-thinh.jpg"`).

> [!TIP]
> **Hosting / Gửi Tặng:**
> Bạn có thể nén thư mục này lại hoặc up lên các nền tảng miễn phí (như Netlify, Vercel, hoặc GitHub Pages) để lấy một đường link trực tiếp và gửi qua điện thoại cho Xuân Thịnh. Chắc chắn bạn ấy sẽ rất wow đó!
