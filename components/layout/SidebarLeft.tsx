import React from "react";
import Link from "next/link";

export default function SidebarLeft() {
  return (
    <div className="_layout_left_sidebar_wrap">
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
          <ul className="_left_inner_area_explore_list">
            <li className="_left_inner_area_explore_item _explore_item">
              <Link href="/" className="_left_inner_area_explore_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path fill="#666" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 1.395a8.605 8.605 0 100 17.21 8.605 8.605 0 000-17.21zm-1.233 4.65l.104.01c.188.028.443.113.668.203 1.026.398 3.033 1.746 3.8 2.563l.223.239.08.092a1.16 1.16 0 01.025 1.405c-.04.053-.086.105-.19.215l-.269.28c-.812.794-2.57 1.971-3.569 2.391-.277.117-.675.25-.865.253a1.167 1.167 0 01-1.07-.629c-.053-.104-.12-.353-.171-.586l-.051-.262c-.093-.57-.143-1.437-.142-2.347l.001-.288c.01-.858.063-1.64.157-2.147.037-.207.12-.563.167-.678.104-.25.291-.45.523-.575a1.15 1.15 0 01.58-.14zm.14 1.467l-.027.126-.034.198c-.07.483-.112 1.233-.111 2.036l.001.279c.009.737.053 1.414.123 1.841l.048.235.192-.07c.883-.372 2.636-1.56 3.23-2.2l.08-.087-.212-.218c-.711-.682-2.38-1.79-3.167-2.095l-.124-.045z" />
                </svg> Learning
              </Link> 
              <span className="_left_inner_area_explore_link_txt">New</span>
            </li>
            {/* Additional items can be added here */}
          </ul>
        </div>
      </div>
      
      <div className="_layout_left_sidebar_inner _mar_t16">
        <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
            <span className="_left_inner_area_suggest_content_txt">
              <Link className="_left_inner_area_suggest_content_txt_link" href="/">See All</Link>
            </span>
          </div>
          {/* Static suggested people for UI completeness */}
          <div className="_left_inner_area_suggest_info">
            <div className="_left_inner_area_suggest_info_box">
              <div className="_left_inner_area_suggest_info_image">
                <img src="/assets/images/people1.png" alt="Image" className="_info_img" />
              </div>
              <div className="_left_inner_area_suggest_info_txt">
                <h4 className="_left_inner_area_suggest_info_title">Steve Jobs</h4>
                <p className="_left_inner_area_suggest_info_para">CEO of Apple</p>
              </div>
            </div>
            <div className="_left_inner_area_suggest_info_link">
              <Link href="/" className="_info_link">Connect</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
