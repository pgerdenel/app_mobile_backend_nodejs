export const paramMissingError = 'One or more of the required parameters was missing.';
export const env = ((process.env.NODE_ENV === 'development')?"dev":"prod");
export const result_ok = {"state":"ok"};
export const result_error = {"state":"error"};
export const proto = "http://";
export const protos = "https://";
export const host_ip = "192.168.3.101";
export const host_local_ip = "127.0.0.1";
export const host_port = ":3000";
export const url_base_http_local = proto+host_local_ip+host_port+"/";
export const url_base_http_distant = proto+host_ip+host_port+"/";
export const url_base_https_local = protos+host_local_ip+host_port+"/";
export const url_base_https_distant = protos+host_ip+host_port+"/";
export const current_img_extension = ".png";
export const public_folder_path = (env === 'dev')?"./src/":"./dist/";

export const current_ip_config = url_base_http_distant; // <===========================================================

export const all_host_endpoint = {
    "endpoint_imgs": "media/imgs/",
    "endpoint_gallery": "media/imgs/gallery/",
    "endpoint_prez" : "media/imgs/prez/",
    "endpoint_home" : "media/imgs/home/",
    "endpoint_actu" : "media/imgs/actu/",
    "img_defaut" :"media/imgs/no_img.png"
};
export const paths_public_folder = {
  "imgs_home": public_folder_path +"public/media/imgs/home/",
  "imgs_prez": public_folder_path +"public/media/imgs/prez/",
  "imgs_actu": public_folder_path +"public/media/imgs/actu/",
  "imgs_gallery":public_folder_path+"public/media/imgs/gallery/"
};
