import React from "react";
import Link from "next/link";

export default function SidebarRight() {
  return (
    <div className="_layout_right_sidebar_wrap">
      <div className="_layout_right_sidebar_inner">
        <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_right_inner_area_info_content _mar_b24">
            <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
            <span className="_right_inner_area_info_content_txt">
              <Link className="_right_inner_area_info_content_txt_link" href="/">See All</Link>
            </span>
          </div>
          <hr className="_underline" />
          <div className="_right_inner_area_info_ppl">
            <div className="_right_inner_area_info_box">
              <div className="_right_inner_area_info_box_image">
                <img src="/assets/images/Avatar.png" alt="Image" className="_ppl_img" />
              </div>
              <div className="_right_inner_area_info_box_txt">
                <h4 className="_right_inner_area_info_box_title">Radovan SkillArena</h4>
                <p className="_right_inner_area_info_box_para">Founder & CEO at Trophy</p>
              </div>
            </div>
            <div className="_right_info_btn_grp">
              <button type="button" className="_right_info_btn_link">Ignore</button>
              <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="_layout_right_sidebar_inner _mar_t16">
        <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_feed_top_fixed">
            <div className="_feed_right_inner_area_card_content _mar_b24">
              <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
            </div>
          </div>
          {/* Static friend list for UI completeness */}
          <div className="_feed_right_inner_area_box">
             {/* Friend items would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
