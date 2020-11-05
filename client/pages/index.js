const { default: Link } = require("next/link");

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <th>
          <Link href="/ticket/[ticketId" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </th>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  //console.log(context.req.headers);

  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
