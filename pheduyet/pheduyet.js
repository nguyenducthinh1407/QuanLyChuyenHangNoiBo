//thông báo
const item2 = document.querySelector(".item2_link");
const bangThongbao = item2.querySelector(".bang_thong_bao");

item2.addEventListener("click", function (event) {
  event.preventDefault();
  bangThongbao.style.display = "block";

  event.stopPropagation();
});

bangThongbao.addEventListener("click", function (event) {
  event.stopPropagation();
});

document.addEventListener("click", function () {
  bangThongbao.style.display = "none";
});

// mo phe duyet
function moPheduyet() {
  window.location.href = "../pheduyet/pheduyet.html";
}

// mo Kho
function moQuanlykho() {
  window.location.href = "../quanlykho/qlk.html";
}

// mo Quanlynhapkho
function moQuanlynhapkho() {
  window.location.href = "../quanlynhapkho/qlnk.html";
}

// mo Quanlynhanvienkho
function moQuanlynhanvienkho() {
  window.location.href = "../quanlynhanvienkho/qlnvk.html";
}

function moQuanlysanpham() {
  window.location.href = "../quanlysanpham/qlsp.html";
}

// mo Quanlychuyenhang
function moQuanlychuyenhang() {
  window.location.href = "../quanlychuyenhang/qlch.html";
}

var duLieuPheDuyet = document.querySelector("#phieu_phe_duyet_list");

function renderPhieuPheDuyet(dlPhieuChuyen) {
  var htmls = dlPhieuChuyen
    .filter(phieu => phieu.ma_trang_thai == 1) 
    .map(function (phieu) {
      return `
      <div class="phieu_phe_duyet" data-ma-phieu-chuyen="${phieu.ma_phieu_chuyen}">
          <div class="mpc">${phieu.ma_phieu_chuyen}</div>
          <div class="kn">${phieu.kho_nhap}</div>
          <div class="nc">${phieu.ngay_chuyen}</div>
          <button class="tuchoi">Từ chối</button>
          <button class="duyet">Duyệt</button>
      </div>
    `;
    });
  duLieuPheDuyet.innerHTML = htmls.join("");

  addEventListenersToButtons();
}

function addEventListenersToButtons() {
  document.querySelectorAll('.phieu_phe_duyet .tuchoi').forEach(button => {
    button.onclick = function() {
      const maPhieuChuyen = this.closest('.phieu_phe_duyet').dataset.maPhieuChuyen;
      updateTrangThaiPhieuChuyen(maPhieuChuyen, 4); 
    };
  });

  document.querySelectorAll('.phieu_phe_duyet .duyet').forEach(button => {
    button.onclick = function() {
      const maPhieuChuyen = this.closest('.phieu_phe_duyet').dataset.maPhieuChuyen;
      updateTrangThaiPhieuChuyen(maPhieuChuyen, 3); 
    };
  });
}

function updateTrangThaiPhieuChuyen(maPhieuChuyen, newStatus) {
  const updateData = {
    ma_phieu_chuyen: maPhieuChuyen,
    ma_trang_thai: newStatus
  };
  
  console.log("Sending update request for:", updateData);
  console.log("To URL:", 'https://localhost:7103/api/QuanLyChuyenHang/updateTrangThaiPhieuChuyen');
  
  fetch('https://localhost:7103/api/QuanLyChuyenHang/updateTrangThaiPhieuChuyen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Update successful:', data);
    start(); 
  })
  .catch(error => {
    console.error('Error updating status:', error);
  });
}

function start() {
  fetch(
    "https://localhost:7103/api/QuanLyChuyenHang/getAllQuanLyChuyenHang"
  )
    .then((res) => res.json())
    .then((dlPhieuChuyen) => {
      renderPhieuPheDuyet(dlPhieuChuyen);
    })
    .catch((error) => {
      console.error("Error fetching transfer slips:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  start();
});
