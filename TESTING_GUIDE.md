# 🧪 Hướng Dẫn Viết Unit Test

## 📁 Cấu Trúc Thư Mục Test

```
src/
└── __tests__/
    ├── setup.js                 # File setup cho tất cả tests
    ├── utils/
    │   └── testUtils.jsx        # Helper functions cho testing
    ├── components/              # Tests cho components
    │   ├── Toast.test.jsx
    │   └── Spinner.test.jsx
    └── pages/                   # Tests cho pages
        ├── Login.test.jsx
        └── Register.test.jsx
```

## 🚀 Chạy Tests

```bash
# Chạy tất cả tests (watch mode)
npm test

# Chạy tests 1 lần (CI mode)
npm run test:run

# Chạy tests với UI đẹp
npm run test:ui

# Chạy tests với coverage report
npm run test:coverage
```

## 📝 Quy Tắc Đặt Tên File Test

1. **Components**: `ComponentName.test.jsx`
   - Ví dụ: `Button.test.jsx`, `Modal.test.jsx`

2. **Pages**: `PageName.test.jsx`
   - Ví dụ: `Dashboard.test.jsx`, `Profile.test.jsx`

3. **Hooks**: `useHookName.test.js`
   - Ví dụ: `useAuth.test.js`, `useForm.test.js`

4. **Utils/Services**: `functionName.test.js`
   - Ví dụ: `validation.test.js`, `api.test.js`

## 🎯 Cấu Trúc Một Test File Chuẩn

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../utils/testUtils';
import YourComponent from '../../components/YourComponent';

// Mock dependencies nếu cần
vi.mock('../../hooks/someHook', () => ({
    useSomeHook: () => ({
        someFunction: vi.fn(),
    }),
}));

describe('YourComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render component with correct elements', () => {
            renderWithRouter(<YourComponent />);
            expect(screen.getByText('Some Text')).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should handle button click', async () => {
            const user = userEvent.setup();
            renderWithRouter(<YourComponent />);
            
            const button = screen.getByRole('button');
            await user.click(button);
            
            // Assertions...
        });
    });

    describe('Validation', () => {
        it('should show error for invalid input', async () => {
            // Test code...
        });
    });
});
```

## 🔧 Helper Functions Có Sẵn

### 1. `renderWithRouter(component, options)`
Render component với React Router context.

```javascript
import { renderWithRouter } from '../utils/testUtils';

renderWithRouter(<YourPage />);
```

### 2. `wait(ms)`
Đợi một khoảng thời gian (dùng cho async operations).

```javascript
import { wait } from '../utils/testUtils';

await wait(1000); // Wait 1 second
```

### 3. `mockAuthContext`
Mock Auth context cho testing.

```javascript
import { mockAuthContext } from '../utils/testUtils';

vi.mock('../../hooks/auth', () => ({
    useAuth: () => mockAuthContext,
}));
```

## 📚 Các Test Cases Nên Có

### Cho Components:

1. **Rendering Tests**
   - ✅ Component render đúng
   - ✅ Hiển thị đúng props
   - ✅ Conditional rendering

2. **User Interaction Tests**
   - ✅ Click events
   - ✅ Input changes
   - ✅ Form submissions
   - ✅ Keyboard navigation

3. **State Tests**
   - ✅ State updates đúng
   - ✅ Loading states
   - ✅ Error states

4. **Accessibility Tests**
   - ✅ Labels và IDs đúng
   - ✅ ARIA attributes
   - ✅ Keyboard support

### Cho Pages:

1. **Rendering Tests**
   - ✅ Page elements render đúng
   - ✅ Form fields có đủ

2. **Validation Tests**
   - ✅ Required field validation
   - ✅ Format validation
   - ✅ Custom validation rules
   - ✅ Error messages display

3. **Form Submission Tests**
   - ✅ Valid submission
   - ✅ Invalid submission
   - ✅ Loading state
   - ✅ Success/Error handling

4. **Navigation Tests**
   - ✅ Links đúng route
   - ✅ Redirect after action

## 🎨 Ví Dụ Test Cases Phổ Biến

### 1. Test Input Field

```javascript
it('should update input value on change', async () => {
    const user = userEvent.setup();
    renderWithRouter(<YourForm />);
    
    const input = screen.getByLabelText(/email/i);
    await user.type(input, 'test@example.com');
    
    expect(input).toHaveValue('test@example.com');
});
```

### 2. Test Form Validation

```javascript
it('should show error for empty field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<YourForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
        expect(screen.getByText(/field is required/i)).toBeInTheDocument();
    });
});
```

### 3. Test API Call

```javascript
it('should call API with correct data', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValue({});
    
    vi.mock('../../api/service', () => ({
        submitData: mockSubmit,
    }));
    
    renderWithRouter(<YourForm />);
    
    // Fill form...
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
            // expected data
        });
    });
});
```

### 4. Test Loading State

```javascript
it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
    );
    
    renderWithRouter(<YourForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
});
```

### 5. Test Navigation

```javascript
it('should navigate to correct page', () => {
    renderWithRouter(<YourComponent />);
    
    const link = screen.getByRole('link', { name: /go to page/i });
    expect(link).toHaveAttribute('href', '/target-page');
});
```

## 🎯 Best Practices

### ✅ DOs:

1. **Viết test mô tả rõ ràng**
   ```javascript
   it('should show error when email format is invalid')
   // ❌ it('test email')
   ```

2. **Dùng `screen` queries**
   ```javascript
   screen.getByRole('button', { name: /submit/i })
   // ❌ container.querySelector('button')
   ```

3. **Test từ góc nhìn người dùng**
   ```javascript
   await user.type(emailInput, 'test@example.com');
   await user.click(submitButton);
   ```

4. **Dọn dẹp sau mỗi test**
   ```javascript
   beforeEach(() => {
       vi.clearAllMocks();
   });
   ```

5. **Group tests theo logic**
   ```javascript
   describe('Form Validation', () => {
       describe('Email Field', () => {
           it('should validate email format');
           it('should require email');
       });
   });
   ```

### ❌ DON'Ts:

1. **Không test implementation details**
2. **Không dùng quá nhiều snapshots**
3. **Không viết tests phụ thuộc lẫn nhau**
4. **Không skip tests trong production**

## 🔍 Query Priority

Thứ tự ưu tiên khi select elements:

1. `getByRole` - Tốt nhất cho accessibility
2. `getByLabelText` - Form fields
3. `getByPlaceholderText` - Khi không có label
4. `getByText` - Không phải form elements
5. `getByTestId` - Last resort

## 📊 Coverage Goals

- **Components**: 80%+
- **Pages**: 90%+
- **Utilities**: 95%+
- **Critical paths**: 100%

## 🐛 Debug Tips

```javascript
// In test file
import { screen } from '@testing-library/react';

// Print current DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Use logTestingPlaygroundURL
import { logTestingPlaygroundURL } from '@testing-library/react';
logTestingPlaygroundURL();
```

## 📖 Resources

- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Docs](https://vitest.dev/)
- [Common Testing Library Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 💡 Khi Thêm Test Mới

1. Tạo file test trong thư mục tương ứng:
   - Components → `src/__tests__/components/`
   - Pages → `src/__tests__/pages/`
   - Hooks → `src/__tests__/hooks/`
   - Utils → `src/__tests__/utils/`

2. Import các helper functions từ `testUtils.jsx`

3. Viết tests theo cấu trúc chuẩn (xem ví dụ trên)

4. Chạy `npm test` để verify

5. Đảm bảo coverage không giảm

**Happy Testing! 🎉**
