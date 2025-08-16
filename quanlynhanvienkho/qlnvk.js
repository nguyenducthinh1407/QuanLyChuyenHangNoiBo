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
  window.location.href = "../pheduyet/pheduyet.html"
}

// mo Kho
function moQuanlykho() {
  window.location.href = "../quanlykho/qlk.html";
}

// mo Quanlynhapkho
function moQuanlynhapkho(){
  window.location.href = "../quanlynhapkho/qlnk.html";
}

// mo Quanlychuyenhang
function moQuanlychuyenhang(){
  window.location.href = "../quanlynhanvienkho/qlnvk.html"
}

function moQuanlysanpham(){
  window.location.href = "../quanlysanpham/qlsp.html"
}

// mo Quanlychuyenhang
function moQuanlychuyenhang(){
  window.location.href = "../quanlychuyenhang/qlch.html"
}

//thêm bảng nhân viên
const bangThemNhanVienKho = document.querySelector(".bang_them_nhan_vien_kho");
const btnHuy = document.querySelector(".huy");

bangThemNhanVienKho.style.display = "none";

function openthem() {
  bangThemNhanVienKho.style.display = "block";
}

function opensua() {
  if (selectedNhanVienKho) {
    bangThemNhanVienKho.style.display = "block";
    document.querySelector("input[name='ho_ten']").value = selectedNhanVienKho.ho_ten;
    document.querySelector("select[name='vai_tro']").value = selectedNhanVienKho.vai_tro;
    document.querySelector("input[name='email']").value = selectedNhanVienKho.email;
    document.querySelector("input[name='so_dien_thoai']").value = selectedNhanVienKho.so_dien_thoai;
    document.querySelector("input[name='dia_chi']").value = selectedNhanVienKho.dia_chi;

    if (document.querySelector("input[name='ma_nv_hidden']")) {
        document.querySelector("input[name='ma_nv_hidden']").value = selectedNhanVienKho.ma_nv;
    }
  } else {
    alert("Vui lòng chọn một nhân viên để chỉnh sửa.");
  }
}

btnHuy.addEventListener("click", function () {
  bangThemNhanVienKho.style.display = "none";
});


//API NhanVien
var duLieuNhanVienKho = document.querySelector(".dulieu");

let selectedNhanVienKho = null;

function renderNhanVienKho(dlNhanVienKho) {
  var htmls = dlNhanVienKho.slice().reverse().map(function (dlnvk) {
    return `
      <div class="dl" data-ma-nv="${dlnvk.ma_nv}">
        <div>${dlnvk.ma_nv}</div>
        <div>${dlnvk.ho_ten}</div>
        <div>${dlnvk.vai_tro}</div>
        <div>${dlnvk.email}</div>
        <div>${dlnvk.so_dien_thoai}</div>
        <div>${dlnvk.dia_chi}</div>
      </div>
    `;
  });
  duLieuNhanVienKho.innerHTML = htmls.join("");

  document.querySelectorAll('.dl').forEach(row => {
    row.addEventListener('click', function() {
      const maNv = this.dataset.maNv;
      selectedNhanVienKho = dlNhanVienKho.find(nv => nv.ma_nv == maNv);
      console.log('Nhân viên đã chọn:', selectedNhanVienKho);
    });
  });
}

function getNhanVienKho(callback) {
  fetch("https://localhost:7103/api/QuanLyNhanVienKho/getAllQuanLyNhanVienKho")
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function start() {
  getNhanVienKho(function (dlNhanVienKho) {
    renderNhanVienKho(dlNhanVienKho);
  });
}

//thêm nhân vien
function xuLyTaoMoi() {
  var taoMoiNhanVienKho = document.querySelector(".luu");

  if (taoMoiNhanVienKho) {
    taoMoiNhanVienKho.addEventListener("click", function(event) {
      event.preventDefault();
      var hoTen = document.querySelector("input[name='ho_ten']").value.trim();
      var chonVaiTro = document.querySelector("select[name='vai_tro']");
      var vaiTro = chonVaiTro.options[chonVaiTro.selectedIndex].textContent.trim();
      var email = document.querySelector("input[name='email']").value.trim();
      var soDienThoai = document.querySelector("input[name='so_dien_thoai']").value.trim();
      var diaChi = document.querySelector("input[name='dia_chi']").value.trim();


      if (!hoTen || !vaiTro || !email || !soDienThoai || !diaChi) {
        alert("Vui lòng điền đầy đủ tất cả các trường.");
        return;
      }

      var nhanvienkhoData = {
        ho_ten: hoTen,
        vai_tro: vaiTro,
        email: email,
        so_dien_thoai: soDienThoai,
        dia_chi: diaChi
      };

      if (selectedNhanVienKho) {
        nhanvienkhoData.ma_nv = selectedNhanVienKho.ma_nv; 
        updateNhanVienKho(nhanvienkhoData);
      } else {
        createNhanVienKho(nhanvienkhoData);
      }
    });
  } else {
    console.error("Không tìm thấy nút 'Lưu' với class '.luu'.");
  }
}

function createNhanVienKho(data) {
  fetch("https://localhost:7103/api/QuanLyNhanVienKho/createQuanLyNhanVienKho", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result && result.TrangThaiCode === 200) {
      alert("Thêm nhân viên kho thành công!");
      document.querySelector(".bang_them_nhan_vien_kho").style.display = "none";
      start();
    } else {
      const msg = result && result.ThongBaoLoi ? result.ThongBaoLoi : "Lỗi";
      alert("Thêm nhân viên kho thất bại: " + msg);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi thêm nhân viên kho.");
  });
}

function updateNhanVienKho(data) {
  fetch("https://localhost:7103/api/QuanLyNhanVienKho/updateQuanLyNhanVienKho", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result && result.TrangThaiCode === 200) {
      alert("Cập nhật nhân viên kho thành công!");
      document.querySelector(".bang_them_nhan_vien_kho").style.display = "none";
      selectedNhanVienKho = null; 
      start();
    } else {
      const msg = result && result.ThongBaoLoi ? result.ThongBaoLoi : "Lỗi";
      alert("Cập nhật nhân viên kho thất bại: " + msg);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi cập nhật nhân viên kho.");
    console.error("Error:", error);
  });
}

function deleteNhanVienKho(maNv) {
  fetch(`https://localhost:7103/api/QuanLyNhanVienKho/deleteQuanLyNhanVienKho?ma_nv=${maNv}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(result => {
    if (result.TrangThaiCode === 200) {
      alert("Nhân viên kho đã được xóa thành công.");
      start(); 
    } else {
      alert("Không thể xóa nhân viên kho: " + result.ThongBaoLoi);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi xóa nhân viên kho.");
    console.error("Error:", error);
  });
}

function openxoa() {
  if (selectedNhanVienKho) {
    if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ${selectedNhanVienKho.ho_ten} không?`)) {
      deleteNhanVienKho(selectedNhanVienKho.ma_nv);
    }
  } else {
    alert("Vui lòng chọn một nhân viên để xóa.");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  start();
  xuLyTaoMoi();
});
