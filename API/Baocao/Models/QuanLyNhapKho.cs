using Newtonsoft.Json;

namespace Baocao.Models
{
    public class QuanLyNhapKho
    {
        public string? ma_nhap { get; set; }
        public string? ma_kho { get; set; }
        public string ma_san_pham { get; set; }
        public int so_luong { get; set; }
        [JsonConverter(typeof(DateFormatConverter), "yyyy-MM-dd")]
        public DateTime ngay_nhap { get; set; }
        public string dien_giai { get; set; }
    }
}
