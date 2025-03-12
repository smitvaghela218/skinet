export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: Address;
    roles: string | null;
}
export type Address = {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}


// "firstName": "Tom",
//     "lastName": "Smith",
//     "email": "tom@test.com",
//     "address": {
//         "line1": "10 The Street",
//         "line2": null,
//         "city": "New Yourk",
//         "state": "NY",
//         "postalCode": "90250",
//         "country": "US"
//     }