## Cài đặt

```
  git clone git@github.com:149311CB/testing-pupeteer.git
  cd testing-pupeteer
  yarn
````

## Test

- Mở file index.test.ts
- UnComment test-case muốn chạy
- Chạy lệnh `node index.test.ts` ở terminal

## Một số lưu ý

- Mỗi folder tương ứng với mỗi test-case
- Các test-case có thể có hình ảnh hoặc dữ liệu khác
- Một số test-case yêu cầu dữ liệu thì bỏ vào file .env
  - Ví dụ test-case 4(test login)
    - Chuyển file env.sample => .env
    - Thêm username, password được setup khi cài đặt orangehrm
    ```
      user=Admin
      password=123456789
    ```
