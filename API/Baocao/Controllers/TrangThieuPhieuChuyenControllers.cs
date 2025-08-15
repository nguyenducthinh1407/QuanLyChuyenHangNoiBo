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
    public class TrangThaiPhieuChuyenController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public TrangThaiPhieuChuyenController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        [Route("getAllTrangThaiPhieuChuyen")]
        public string GetTrangThaiPhieuChuyen()
        {
            var connectionString = _configuration.GetConnectionString("TrangThaiPhieuChuyenAppCon");
            SqlConnection con = new SqlConnection(connectionString);
            SqlDataAdapter da = new SqlDataAdapter("select * from Trang_Thai_Phieu", con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            List<TrangThaiPhieuChuyen> trangthaiphieuchuyenlist = new List<TrangThaiPhieuChuyen>();
            Response response = new Response();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    TrangThaiPhieuChuyen trangthaiphieuchuyen = new TrangThaiPhieuChuyen();
                    trangthaiphieuchuyen.ma_trang_thai = Convert.ToInt32(dt.Rows[i]["ma_trang_thai"]);
                    trangthaiphieuchuyen.ten_trang_thai = Convert.ToString(dt.Rows[i]["ten_trang_thai"]);
                    trangthaiphieuchuyenlist.Add(trangthaiphieuchuyen);
                }
            }
            if (trangthaiphieuchuyenlist.Count > 0)
                return JsonConvert.SerializeObject(trangthaiphieuchuyenlist);
            else
            {
                response.TrangThaiCode = 100;
                response.ThongBaoLoi = "Không tìm thấy dữ liệu ";
                return JsonConvert.SerializeObject(response);
            }
        }
    }
}
