<?php

namespace Cactus\CardDuplicator;

use Laravel\Nova\Nova;
use Laravel\Nova\Tool;

class CardDuplicator extends Tool
{
    /**
     * Perform any tasks that need to happen when the tool is booted.
     *
     * @return void
     */
    public function boot()
    {
        Nova::script('card-duplicator', __DIR__.'/../dist/js/tool.js');
        Nova::style('card-duplicator', __DIR__.'/../dist/css/tool.css');
    }

    /**
     * Build the view that renders the navigation links for the tool.
     *
     * @return \Illuminate\View\View
     */
    public function renderNavigation()
    {
        // We don't want the Card Duplicator to be available via the sidebar navigation. It should only be accessed/initiated
        // . from a Group action
        return null; //view('card-duplicator::navigation');
    }
}
