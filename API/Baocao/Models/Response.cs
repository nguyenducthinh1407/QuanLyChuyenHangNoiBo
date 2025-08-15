namespace Baocao.Models
{
    public class Response
    {
        public int TrangThaiCode { get; set; }
        public string? ThongBaoLoi { get; set; }
        public string? ma_phieu_chuyen { get; set; }
        public string? ma_chi_tiet { get; set; }
    }
}

public class UpdateTrangThaiRequest
{
    public string? ma_phieu_chuyen { get; set; }
    public int ma_trang_thai { get; set; }
}
