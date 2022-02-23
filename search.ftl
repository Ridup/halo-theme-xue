<#include "module/macro.ftl">
<@layout title="搜索结果：${keyword!} - ${blog_title!}">
  <main class="mx-auto dark:bg-gray-900" id="container">
    <header class="bg-gray-900 table fade-down relative w-full opacity-95 z-10 h-1/2">
      <#if settings.search_patternimg?? && settings.search_patternimg!=''>
        <div class="cover-bg bottom-0 left-0 right-0 top-0 opacity-30 absolute">
          <img src="${settings.search_patternimg!}"
               class="h-full w-full left-0 object-cover absolute top-0"
               alt="${keyword!}">
        </div>
      <#else>
        <div class="placeholder-bg">
        </div>
      </#if>
      <div class="h-96 align-middle table-cell relative w-full index flex justify-center">
        <h2 class="text-white mb-5 mt-4 leading-loose relative w-full text-4xl text-center">
          关于「${keyword!}」的搜索结果
        </h2>
        <hr class="text-center bg-red-300 h-0.5 border-none w-20 mx-auto -mt-5 mb-3"/>
      </div>
    </header>

      <#if posts?? && posts.content?size gt 0>
        <div class="mx-auto px-10 mt-16 max-w-4xl tracking-wider md:leading-relaxed sm:leading-normal"
          id="pageContainer">
          <div class="mb-4">
            <!-- search start -->
            <form class="s-search">
              <label class="flex flex-row-reverse flex-grow border-gray-100 border rounded-full">
                <input class="flex-grow p-0 text-xl border-none leading-snug" maxlength="30" name="keyword" spellcheck="false"
                       placeholder="Search" autocomplete="off">
                <span class="p-4 text-2xl opacity-50 transition-opacity iconfont icon-search"></span>
              </label>
            </form>
            <!-- search end -->
          </div>
            <#list posts.content as post>
              <a href="${post.fullPath}" class="ah-hf hover:opacity-70 relative block ml-6 px-0 pt-2 pb-2 leading-8">
                <span class="ah-dt float-left pr-2 whitespace-nowrap tracking-wide text-sm opacity-60" style="line-height: inherit !important;">${post.createTime?string('MM-dd')}</span>
                <span class="ah-tt table-cell text-lg" style="line-height: inherit !important;">${post.title!}</span>
              </a>
            </#list>
        </div>
          <#if posts.totalPages gt 1>
          <#-- 分页-->
            <nav class="pagination flex flex-row justify-center mt-8" role="navigation" aria-label="pagination">
                <@paginationTag method="search" page="${posts.number}" total="${posts.totalPages}" display="3" keyword="${keyword}">
                    <#include "module/widget/pagination.ftl">
                </@paginationTag>
            </nav>
          </#if>
      <#else >
        <div
          class="mx-auto px-10 mt-16 max-w-4xl tracking-wider md:leading-relaxed sm:leading-normal">
          <div id="post-list" class="post-list inner">
            <div class="">
              <!-- search start -->
              <form class="s-search">
                <label class="flex flex-row-reverse flex-grow border-gray-100 border rounded-full">
                  <input class="flex-grow p-0 text-xl border-none leading-snug" maxlength="30" name="keyword" spellcheck="false"
                         placeholder="Search" autocomplete="off">
                  <span class="p-4 text-2xl opacity-50 transition-opacity iconfont icon-search"></span>
                </label>
              </form>
              <!-- search end -->
            </div>
            <section class="no-results not-found">
              <header class="not-found-header">
                <h1 class="not-found-title">Sorry! Nothing Found...</h1>
              </header><!-- .page-header -->

              <div class="page-content">
                  <#if is_search??>
                    <div class="sorry">
                      <p>没有找到你想要的，看看其他的吧。</p>
                      <div class="sorry-inner">
                        <ul class="search-no-results">
                            <@postTag method="latest" top="10">
                                <#list posts as post>
                                  <li>
                                    <a class="ah-hf hover:opacity-70 relative block ml-6 px-0 pt-2 pb-2 leading-8" href="${post.fullPath!}">
                                      <span class="ah-dt float-left pr-2 whitespace-nowrap tracking-wide text-sm opacity-60" style="line-height: inherit !important;">${post.createTime?string('MM-dd')}</span>
                                      <span class="ah-tt table-cell text-lg" style="line-height: inherit !important;">${post.title!}</span>
                                    </a>
                                  </li>
                                </#list>
                            </@postTag>
                        </ul>
                      </div>
                    </div>
                  <#else>
                    <p>我们似乎没有找到你想要的东西. 或许你可以搜索一下试试.</p>
                  </#if>
              </div><!-- .page-content -->
            </section>
          </div>
        </div>
      </#if>

  </main>
</@layout>