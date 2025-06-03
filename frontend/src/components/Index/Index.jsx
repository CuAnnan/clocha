import {Container} from "react-bootstrap";

function Index()
{
    return (<Container>
        <h1>Clocha Archaeological Site Listing</h1>
        <p>The purpose of this application is to track the state of degredation of stone circles, ringforts and other medieval and iron age sites in Ireland. While there is a registration process, and while you can technically sign up, I have not yet written the account moderation and approval system so all new accounts are left unapproved.</p>
        <p>Being an improvement of a much earlier system, this version of the clocha project is built on top of the MERN stack. The Mongo Queries have been improved index-wise and the query method in the express end has been improved to streamline point of interest fetching; the indexed db is properly populated and checked, only new sites are loaded.</p>
        <p>I'm now using SuperCluster instead of MarkerCluster, which handles the loading of the 50,000+ sites much faster. Links are now offered for google maps, apple maps, and open maps from the get-go</p>
    </Container>);
}

export default Index;