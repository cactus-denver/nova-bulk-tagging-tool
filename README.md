# nova-bulk-tagging-tool

This is a bulk action tool for the CMS at YOU at college. It handles most
of the complex actions that require user input.

Nova Tools Documentation: https://nova.laravel.com/docs/3.0/customization/tools.html#defining-tools

Here is a list of current actions:

### Group

* Bulk tag - Tags cards in a particular group to any of the supported models below. Note: the selection of models is initially filtered by AppType.
    * RealityCheckQuestion (subdomain)
* Card Type Change - gets a list of cards from a group and allows user to change selected cards type

### Card

* Bulk tag - Tags selected cards to any of the supported models below. Note: the selection of models is initially filtered by AppType.
    * ProfileAnswer
    * RealityCheckQuestion (subdomain)

