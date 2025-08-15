using Newtonsoft.Json;

namespace Baocao.Models
{
    public class QuanLyChuyenHang
    {
        public string? ma_phieu_chuyen { get; set; }
        public string? kho_xuat { get; set; }
        public string kho_nhap { get; set; }
        public string ma_nv_tao { get; set; }

        [JsonConverter(typeof(DateFormatConverter), "yyyy-MM-dd")]
        public DateTime ngay_chuyen { get; set; }
        public int ma_trang_thai { get; set; }
        public string dien_giai { get; set; }
    }
}
