const urlBuilder = require('../../services/urlBuilder');

describe('services/urlBuilder', () => {
  it('should not return a string event if there is no variables', () => {
    const url = urlBuilder('http://wiki.federation.com/armaments');
    expect(url).toBeInstanceOf(Function);
    expect(url()).toEqual('http://wiki.federation.com/armaments');
  });
  it('should return a function when a variable exists', () => {
    const url = urlBuilder('http://wiki.federation.com/{body.id}/armaments');
    expect(url).toBeInstanceOf(Function);
  });
  it('should catch multiple variables', () => {
    const url = urlBuilder('http://wiki.federation.com/{body.id}/armaments/{body.type}');
    expect(url).toBeInstanceOf(Function);
  });
  it('should set the values to the url', () => {
    const url = urlBuilder('http://wiki.federation.com/{body.id}/armaments');
    const container = {
      body: {
        id: 'NCC-1701',
      },
    };
    expect(url(container)).toBe('http://wiki.federation.com/NCC-1701/armaments');
  });
  it('should set the values to an url finishing with a variable', () => {
    const url = urlBuilder('http://wiki.federation.com/{body.id}/armaments/{body.type}');
    const container = {
      body: {
        id: 'NCC-1701',
        type: 'photon',
      },
    };
    expect(url(container)).toBe('http://wiki.federation.com/NCC-1701/armaments/photon');
  });
  it('should throw an error if there is a missing variable', () => {
    const url = urlBuilder('http://wiki.federation.com/{body.id}/armaments/{body.type}');
    const container = {
      body: {
        id: 'NCC-1701',
      },
    };
    expect(() => url(container)).toThrow();
  });
  it('should work with complex paths', () => {
    const url = urlBuilder('http://wiki.federation.com/{body.fleet.ships[1].name}');
    const container = {
      body: {
        fleet: {
          ships: [
            { name: 'NCC-1701' },
            { name: 'NCC-1700' },
          ],
        },
      },
    };
    expect(url(container)).toBe('http://wiki.federation.com/NCC-1700');
  });
  it('should encode values', () => {
    const url = urlBuilder('http://wiki.federation.com/{body.shipPassword}');
    const container = {
      body: {
        shipPassword: '//borgs & romulians are week$',
      },
    };
    expect(url(container)).toEqual('http://wiki.federation.com/%2F%2Fborgs%20%26%20romulians%20are%20week%24');
  });
});
