using Baocao.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json.Serialization;

namespace Baocao.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietPhieuChuyenController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public ChiTietPhieuChuyenController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("createChiTietPhieuChuyen")]
        public string createChiTietPhieuChuyen([FromBody] List<ChiTietPhieuChuyen> chiTietPhieuChuyenList)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("ChiTietPhieuChuyenAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    foreach (var chiTietPhieuChuyen in chiTietPhieuChuyenList)
                    {
                        Console.WriteLine($"DEBUG: ma_phieu_chuyen: {chiTietPhieuChuyen.ma_phieu_chuyen}, ma_san_pham: {chiTietPhieuChuyen.ma_san_pham}, so_luong: {chiTietPhieuChuyen.so_luong}");
                        using (SqlCommand cmd = new SqlCommand("sThemChiTietPhieuChuyen", con))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@ma_phieu_chuyen", chiTietPhieuChuyen.ma_phieu_chuyen);
                            cmd.Parameters.AddWithValue("@ma_san_pham", chiTietPhieuChuyen.ma_san_pham);
                            cmd.Parameters.AddWithValue("@so_luong", chiTietPhieuChuyen.so_luong);

                            SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                            retParam.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(retParam);

                            SqlParameter maChiTietParam = new SqlParameter("@ma_chi_tiet_out", SqlDbType.VarChar, 10); 
                            maChiTietParam.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(maChiTietParam);

                            cmd.ExecuteNonQuery();

                            bool result = (bool)retParam.Value;

                            if (result)
                            {
                                if (maChiTietParam.Value != DBNull.Value)
                                {
                                    chiTietPhieuChuyen.ma_chi_tiet = maChiTietParam.Value.ToString();
                                }
                            }

                            if (!result)
                            {
                                response.TrangThaiCode = 100;
                                response.ThongBaoLoi = "Không thể tạo phiếu chuyển chi tiết cho sản phẩm: " + chiTietPhieuChuyen.ma_san_pham;
                                return JsonConvert.SerializeObject(response); 
                            }
                        }
                    }
                    response.TrangThaiCode = 200;
                    response.ThongBaoLoi = "Phiếu chuyển chi tiết đã được tạo thành công";
                    response.ma_phieu_chuyen = chiTietPhieuChuyenList.FirstOrDefault()?.ma_phieu_chuyen;
                }
            }
            catch (Exception ex)
            {
                response.TrangThaiCode = 500;
                response.ThongBaoLoi = ex.Message;
            }
            return JsonConvert.SerializeObject(response);
        }

        [HttpGet]
        [Route("getByMaPhieuChuyen/{ma_phieu_chuyen}")]
        public string GetChiTietPhieuChuyenByMaPhieuChuyen(string ma_phieu_chuyen)
        {
            var connectionString = _configuration.GetConnectionString("ChiTietPhieuChuyenAppCon");
            SqlConnection con = new SqlConnection(connectionString);
            SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM Chi_Tiet_Phieu_Chuyen WHERE ma_phieu_chuyen = @ma_phieu_chuyen", con);
            da.SelectCommand.Parameters.AddWithValue("@ma_phieu_chuyen", ma_phieu_chuyen);
            DataTable dt = new DataTable();
            da.Fill(dt);
            List<ChiTietPhieuChuyen> chitietphieuchuyenlist = new List<ChiTietPhieuChuyen>();
            Response response = new Response();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    ChiTietPhieuChuyen chitietphieuchuyen = new ChiTietPhieuChuyen();
                    chitietphieuchuyen.ma_chi_tiet = Convert.ToString(dt.Rows[i]["ma_chi_tiet"]);
                    chitietphieuchuyen.ma_phieu_chuyen = Convert.ToString(dt.Rows[i]["ma_phieu_chuyen"]);
                    chitietphieuchuyen.ma_san_pham = Convert.ToString(dt.Rows[i]["ma_san_pham"]);
                    chitietphieuchuyen.so_luong = Convert.ToInt32(dt.Rows[i]["so_luong"]);
                    chitietphieuchuyenlist.Add(chitietphieuchuyen);
                }
            }

            if (chitietphieuchuyenlist.Count > 0)
                return JsonConvert.SerializeObject(chitietphieuchuyenlist);
            else
            {
                response.TrangThaiCode = 100;
                response.ThongBaoLoi = "Không tìm thấy chi tiết phiếu chuyển cho mã phiếu này.";
                return JsonConvert.SerializeObject(response);
            }
        }

        [HttpPut]
        [Route("updateChiTietPhieuChuyen")]
        public string UpdateChiTietPhieuChuyen([FromBody] ChiTietPhieuChuyen chiTietPhieuChuyen)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("ChiTietPhieuChuyenAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    string errorMessage = "";
                    con.InfoMessage += delegate (object sender, SqlInfoMessageEventArgs e)
                    {
                        errorMessage += e.Message + " ";
                    };
                    using (SqlCommand cmd = new SqlCommand("sCapNhatChiTietPhieuChuyen", con)) 
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_chi_tiet", chiTietPhieuChuyen.ma_chi_tiet);
                        cmd.Parameters.AddWithValue("@ma_phieu_chuyen", chiTietPhieuChuyen.ma_phieu_chuyen);
                        cmd.Parameters.AddWithValue("@ma_san_pham", chiTietPhieuChuyen.ma_san_pham);
                        cmd.Parameters.AddWithValue("@so_luong", chiTietPhieuChuyen.so_luong);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Cập nhật chi tiết phiếu chuyển thành công";
                            response.ma_chi_tiet = chiTietPhieuChuyen.ma_chi_tiet;
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = string.IsNullOrEmpty(errorMessage) ? "Không thể cập nhật chi tiết phiếu chuyển" : errorMessage.Trim();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.TrangThaiCode = 500;
                response.ThongBaoLoi = ex.Message;
            }
            return JsonConvert.SerializeObject(response);
        }

        [HttpDelete]
        [Route("deleteChiTietPhieuChuyen/{ma_chi_tiet}")]
        public string DeleteChiTietPhieuChuyen(string ma_chi_tiet)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("ChiTietPhieuChuyenAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    
                    using (SqlCommand cmd = new SqlCommand("DELETE FROM Chi_Tiet_Phieu_Chuyen WHERE ma_chi_tiet = @ma_chi_tiet", con))
                    {
                        cmd.Parameters.AddWithValue("@ma_chi_tiet", ma_chi_tiet);
                        int rowsAffected = cmd.ExecuteNonQuery();
                        
                        if (rowsAffected > 0)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Xóa chi tiết phiếu chuyển thành công";
                            response.ma_chi_tiet = ma_chi_tiet;
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không tìm thấy chi tiết phiếu chuyển để xóa";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.TrangThaiCode = 500;
                response.ThongBaoLoi = ex.Message;
            }
            return JsonConvert.SerializeObject(response);
        }
    }
}
