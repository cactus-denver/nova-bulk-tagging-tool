<?php

namespace Cactus\BulkTagging;

use Laravel\Nova\Nova;
use Laravel\Nova\Tool;

class BulkTagging extends Tool
{
    /**
     * Perform any tasks that need to happen when the tool is booted.
     *
     * @return void
     */
    public function boot()
    {
        Nova::script('bulk-tagging', __DIR__.'/../dist/js/tool.js');
        Nova::style('bulk-tagging', __DIR__.'/../dist/css/tool.css');
    }

    /**
     * Build the view that renders the navigation links for the tool.
     *
     * @return \Illuminate\View\View
     */
    public function renderNavigation()
    {
        // We don't want the Bulk Tagger to be available via the sidebar navigation. It should only be accessed/initiated
        // . from a Card action
        return null; // view('bulk-tagging::navigation');
    }
}
