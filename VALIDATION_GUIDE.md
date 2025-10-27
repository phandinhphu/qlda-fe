# Hướng dẫn sử dụng Toast và Validation

## Các component đã được tạo

### 1. Toast Component (`src/components/Toast.jsx`)
Component hiển thị thông báo chuyên nghiệp với 4 loại:
- `success` - Thông báo thành công (màu xanh lá)
- `error` - Thông báo lỗi (màu đỏ)
- `warning` - Thông báo cảnh báo (màu vàng)
- `info` - Thông báo thông tin (màu xanh dương)

**Tính năng:**
- Auto close sau 3 giây (có thể tùy chỉnh)
- Icon tự động theo loại thông báo
- Nút đóng thủ công
- Animation fade in/slide in

### 2. Spinner Component (`src/components/Spinner.jsx`)
Component loading spinner với 3 kích thước: `sm`, `md`, `lg`

## Cải tiến Login & Register

### ✅ Validation chi tiết

**Login:**
- Email: Kiểm tra định dạng email hợp lệ
- Password: Tối thiểu 6 ký tự

**Register:**
- Tên hiển thị: Tối thiểu 2 ký tự
- Email: Định dạng email hợp lệ
- Password: Tối thiểu 6 ký tự, phải có chữ hoa và chữ thường
- Xác nhận mật khẩu: Phải khớp với mật khẩu

### ✅ Thông báo lỗi inline
- Hiển thị lỗi ngay dưới field có vấn đề
- Icon cảnh báo đỏ
- Border đỏ cho input lỗi
- Tự động xóa lỗi khi người dùng sửa

### ✅ Loading state
- Nút submit hiển thị spinner khi đang gọi API
- Text thay đổi: "Đang đăng nhập..." / "Đang đăng ký..."
- Disable tất cả inputs khi loading
- Cursor not-allowed

### ✅ Toast notification
- Thông báo thành công màu xanh lá
- Thông báo lỗi màu đỏ
- Tự động đóng sau 3 giây
- Có thể đóng thủ công

## Demo validation

### Các trường hợp lỗi sẽ được bắt:

**Login:**
```
Email trống → "Email là bắt buộc"
Email sai format → "Email không hợp lệ"
Password trống → "Mật khẩu là bắt buộc"
Password < 6 ký tự → "Mật khẩu phải có ít nhất 6 ký tự"
```

**Register:**
```
Tên < 2 ký tự → "Tên hiển thị phải có ít nhất 2 ký tự"
Email sai format → "Email không hợp lệ"
Password không đủ mạnh → "Mật khẩu phải chứa cả chữ hoa và chữ thường"
Confirm không khớp → "Mật khẩu xác nhận không khớp"
```

## Cách sử dụng Toast trong component khác

```jsx
import Toast from '../components/Toast';

const YourComponent = () => {
    const [toast, setToast] = useState(null);

    const showSuccess = () => {
        setToast({
            message: 'Thao tác thành công!',
            type: 'success'
        });
    };

    return (
        <div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    duration={3000}
                />
            )}
            <button onClick={showSuccess}>Show Toast</button>
        </div>
    );
};
```
