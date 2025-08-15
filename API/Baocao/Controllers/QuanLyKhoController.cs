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
    public class QuanLyKhoController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public QuanLyKhoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        [Route("getAllQuanLyKho")]
        public string GetQuanLyKho()
        {
            var connectionString = _configuration.GetConnectionString("QuanLyKhoAppCon");
            SqlConnection con = new SqlConnection(connectionString);
            SqlDataAdapter da = new SqlDataAdapter("select * from Kho", con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            List<QuanLyKho> quanlykholist = new List<QuanLyKho>();
            Response response = new Response();
            if (dt.Rows.Count > 0)
            {
                for(int i = 0; i < dt.Rows.Count; i++)
                {
                    QuanLyKho quanlykho = new QuanLyKho();
                    quanlykho.ma_kho = Convert.ToString(dt.Rows[i]["ma_kho"]);
                    quanlykho.ten = Convert.ToString(dt.Rows[i]["ten"]);
                    quanlykho.dia_chi = Convert.ToString(dt.Rows[i]["dia_chi"]);
                    quanlykholist.Add(quanlykho); 
                }
            }
            if (quanlykholist.Count > 0)
                return JsonConvert.SerializeObject(quanlykholist);
            else
            {
                response.TrangThaiCode = 100;
                response.ThongBaoLoi = "Không tìm thấy dữ liệu ";
                return JsonConvert.SerializeObject(response);
            }    
        }

        [HttpPost]
        [Route("createQuanLyKho")]
        public string createQuanLyKho(QuanLyKho quanLyKho)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("sThemKho", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ten", quanLyKho.ten);
                        cmd.Parameters.AddWithValue("@dia_chi", quanLyKho.dia_chi);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Kho đã được tạo thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể tạo kho";
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

        [HttpPut]
        [Route("updateQuanLyKho")]
        public string updateQuanLyKho(QuanLyKho quanLyKho)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("sCapNhatKho", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_kho", quanLyKho.ma_kho);
                        cmd.Parameters.AddWithValue("@ten", quanLyKho.ten);
                        cmd.Parameters.AddWithValue("@dia_chi", quanLyKho.dia_chi);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Kho đã được cập nhật thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể cập nhật kho";
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
        [Route("deleteQuanLyKho")]
        public string deleteQuanLyKho(string ma_kho)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("sXoaKho", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_kho", ma_kho);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Kho đã được xóa thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể xóa kho";
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
