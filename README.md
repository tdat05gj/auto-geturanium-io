past in console:

__________________________________________________________________________________________________________________________


// Danh sách tiêu đề của các nút
const buttonTitles = [
    'Auto Collector',      // Nút 1
    'Shard Multiplier',    // Nút 2
    'Conveyor Booster'     // Nút 3
];

// Hàm mô phỏng chuỗi sự kiện click
function simulateClick(element) {
    if (!element) return false;
    
    // Kiểm tra trạng thái nút
    if (element.disabled || element.classList.contains('opacity-50')) {
        console.log('Nút bị vô hiệu hóa!');
        return false;
    }
    
    // Tạo các sự kiện
    const events = [
        new Event('mouseover', { bubbles: true }),
        new Event('mousedown', { bubbles: true }),
        new Event('mouseup', { bubbles: true }),
        new Event('click', { bubbles: true })
    ];
    
    // Kích hoạt từng sự kiện
    events.forEach(event => element.dispatchEvent(event));
    return true;
}

// Hàm tìm và click nút
function clickButton(index) {
    const title = buttonTitles[index];
    
    // Tìm tất cả nút
    const buttons = document.querySelectorAll('button');
    let targetElement = null;
    
    // Duyệt để tìm nút đúng
    buttons.forEach(button => {
        const h3 = button.querySelector('h3');
        if (h3 && h3.textContent === title) {
            // Thử các vùng kích hoạt
            const flexDiv = button.querySelector('div.flex.items-start.gap-3');
            const flex1Div = button.querySelector('div.flex-1');
            
            // Ưu tiên: flexDiv > flex1Div > button
            targetElement = flexDiv || flex1Div || button;
        }
    });
    
    if (targetElement) {
        const clicked = simulateClick(targetElement);
        if (clicked) {
            console.log(`Đã click nút ${index + 1}: ${title} (vùng: ${targetElement.className})`);
        } else {
            console.log(`Không thể click nút ${index + 1}: ${title} (vùng bị vô hiệu hóa)`);
        }
    } else {
        console.log(`Không tìm thấy nút ${index + 1}: ${title}`);
    }
}

// Hàm chạy vòng lặp click
function startAutoClick() {
    let currentIndex = 0;
    
    window.autoClickInterval = setInterval(() => {
        clickButton(currentIndex);
        currentIndex = (currentIndex + 1) % buttonTitles.length; // Lặp lại
    }, 300); // 12 giây
}

// Bắt đầu
startAutoClick();

// Để dừng, chạy trong console:
// clearInterval(window.autoClickInterval);


__________________________________________________________________________________________________________________________


end.
